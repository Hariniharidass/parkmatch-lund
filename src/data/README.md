# Park data integration contract

`mockParks.ts` exports typed `Park[]` records and is the only demo-data source used by the UI. Replace that export with an adapter returning the same `Park` interface; components and filtering should not need changes.

Do not assume future CSV headers or coordinate formats. Map display requires WGS84 latitude and longitude. A CSV without coordinates will need a trustworthy geometry source and a separate join before it can be displayed. Map missing values to `null`, never `false`; active filters intentionally exclude unknown values.

The low/mid/high categories must be supplied by the data owner. This app does not invent numeric thresholds.

## Municipality View GeoPackage export

Municipality View intentionally uses a separate real-data path and does not replace `mockParks.ts`. Its source is `data/lund_parks_personas_demographics.gpkg`.

The generated frontend assets are:

- `public/data/lund-parks.geojson` — `parks`, transformed from EPSG:3006 to EPSG:4326 with GDAL/OGR
- `public/data/category-weights.json` — authoritative persona weights and spider-chart field mapping
- `public/data/field-dictionary.json` — field definitions
- `public/data/analysis-metadata.json` — score semantics and limitations

The park conversion was performed with QGIS 3.44.15's `ogr2ogr` using `-t_srs EPSG:4326 -lco RFC7946=YES`. This is a real coordinate transformation, not a CRS relabel. Regenerate these files from the GeoPackage when the source changes; do not hand-edit the exported records.
