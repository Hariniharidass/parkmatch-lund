"""Export browser-ready park and amenity data from the project GeoPackage.

This intentionally uses only Python's standard library so it also works on
managed Windows machines where native GDAL/PROJ DLLs are blocked.
"""

import json
import math
import re
import sqlite3
import struct
from pathlib import Path


ROOT = Path(__file__).parents[1]
SOURCE = ROOT / "data" / "lund_parks_personas_demographics.gpkg"
PUBLIC_DATA = ROOT / "public" / "data"


def gpkg_point(blob: bytes) -> tuple[float, float]:
    if blob[:2] != b"GP":
        raise ValueError("Not a GeoPackage geometry")
    flags = blob[3]
    envelope_code = (flags >> 1) & 0b111
    envelope_sizes = {0: 0, 1: 4, 2: 6, 3: 6, 4: 8}
    offset = 8 + envelope_sizes[envelope_code] * 8
    byte_order = "<" if blob[offset] == 1 else ">"
    geometry_type = struct.unpack_from(f"{byte_order}I", blob, offset + 1)[0] % 1000
    if geometry_type != 1:
        raise ValueError(f"Expected Point WKB, got type {geometry_type}")
    return struct.unpack_from(f"{byte_order}dd", blob, offset + 5)


def sweref99tm_to_wgs84(easting: float, northing: float) -> tuple[float, float]:
    axis = 6378137.0
    flattening = 1.0 / 298.257222101
    central_meridian = math.radians(15.0)
    scale = 0.9996
    false_easting = 500000.0
    e2 = flattening * (2.0 - flattening)
    n = flattening / (2.0 - flattening)
    a_roof = axis / (1.0 + n) * (1.0 + n**2 / 4.0 + n**4 / 64.0)
    d1 = n / 2.0 - 2.0 * n**2 / 3.0 + 37.0 * n**3 / 96.0 - n**4 / 360.0
    d2 = n**2 / 48.0 + n**3 / 15.0 - 437.0 * n**4 / 1440.0
    d3 = 17.0 * n**3 / 480.0 - 37.0 * n**4 / 840.0
    d4 = 4397.0 * n**4 / 161280.0
    astar = e2 + e2**2 + e2**3 + e2**4
    bstar = -(7.0 * e2**2 + 17.0 * e2**3 + 30.0 * e2**4) / 6.0
    cstar = (224.0 * e2**3 + 889.0 * e2**4) / 120.0
    dstar = -(4279.0 * e2**4) / 1260.0
    xi = northing / (scale * a_roof)
    eta = (easting - false_easting) / (scale * a_roof)
    xi_prim = xi
    eta_prim = eta
    for order, delta in ((1, d1), (2, d2), (3, d3), (4, d4)):
        xi_prim -= delta * math.sin(2 * order * xi) * math.cosh(2 * order * eta)
        eta_prim -= delta * math.cos(2 * order * xi) * math.sinh(2 * order * eta)
    phi_star = math.asin(math.sin(xi_prim) / math.cosh(eta_prim))
    delta_lon = math.atan(math.sinh(eta_prim) / math.cos(xi_prim))
    sin_phi = math.sin(phi_star)
    cos_phi = math.cos(phi_star)
    latitude = phi_star + sin_phi * cos_phi * (
        astar + bstar * sin_phi**2 + cstar * sin_phi**4 + dstar * sin_phi**6
    )
    return math.degrees(central_meridian + delta_lon), math.degrees(latitude)


def rows_as_dicts(connection: sqlite3.Connection, table: str) -> list[dict]:
    cursor = connection.execute(f'SELECT * FROM "{table}"')
    names = [item[0] for item in cursor.description]
    return [dict(zip(names, row)) for row in cursor]


def main() -> None:
    connection = sqlite3.connect(SOURCE)
    connection.row_factory = sqlite3.Row

    parks_path = PUBLIC_DATA / "lund-parks.geojson"
    parks = json.loads(parks_path.read_text(encoding="utf-8"))
    park_rows = {
        row["park_id"]: {key: value for key, value in dict(row).items() if key not in {"fid", "geom"}}
        for row in connection.execute('SELECT * FROM "parks"')
    }
    for feature in parks["features"]:
        park_id = feature["properties"]["park_id"]
        if park_id not in park_rows:
            raise ValueError(f"Park {park_id} is missing from the GeoPackage")
        feature["properties"] = park_rows[park_id]
    parks_path.write_text(json.dumps(parks, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")

    amenities = []
    for row in connection.execute('SELECT * FROM "amenities"'):
        item = dict(row)
        easting, northing = gpkg_point(item.pop("geom"))
        longitude, latitude = sweref99tm_to_wgs84(easting, northing)
        item.pop("fid", None)
        item["park_ids"] = [value for value in re.split(r"[|,]", item.get("park_ids") or "") if value]
        amenities.append({
            "type": "Feature",
            "geometry": {"type": "Point", "coordinates": [longitude, latitude]},
            "properties": item,
        })
    amenity_collection = {"type": "FeatureCollection", "features": amenities}
    (PUBLIC_DATA / "amenities.geojson").write_text(
        json.dumps(amenity_collection, ensure_ascii=False, separators=(",", ":")), encoding="utf-8"
    )

    weights = rows_as_dicts(connection, "category_weights")
    weight_collection = {
        "type": "FeatureCollection",
        "name": "category_weights",
        "features": [{"type": "Feature", "properties": row, "geometry": None} for row in weights],
    }
    (PUBLIC_DATA / "category-weights.json").write_text(
        json.dumps(weight_collection, ensure_ascii=False, separators=(",", ":")), encoding="utf-8"
    )
    print(f"Exported {len(parks['features'])} parks and {len(amenities)} amenities")


if __name__ == "__main__":
    main()
