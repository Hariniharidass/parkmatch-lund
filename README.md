# ParkLens Lund

ParkLens is a Svelte 5, TypeScript, Vite, and Leaflet web app for exploring Lund's parks. It combines park polygons, mapped amenity locations, provisional quality profiles, and nearby demographic estimates exported from the project GeoPackage.

The app provides two coordinated views:

- **Find a Park** filters parks using mapped amenities. Matching parks are emphasized and fitted on the map; selecting a park shows its scores, facility counts, and amenity markers.
- **Municipality View** compares General, Student, Family, and Elderly profiles, visualizes relative demographic priority or profile quality, and links investigation results to the map and park details.

Light and dark themes are available from the header. The selected theme is stored in the browser.

## Run locally on Windows

Open Command Prompt (`cmd`) and run:

```bat
cd C:\Users\hello\Desktop\SESAC-Hackathon-2026\parkmatch-web
npm install
npm run dev
```

Open the address printed by Vite, normally `http://localhost:5173`. Keep the terminal open while the app is running and press `Ctrl+C` to stop it.

## Build and test

```bat
npm run check
npm test
npm run build
```

The production output is written to `dist`. To preview it locally:

```bat
npm run preview
```

## Data pipeline

The source dataset is `data/lund_parks_personas_demographics.gpkg`. The repeatable export script is:

```bat
python scripts\export_gpkg.py
```

It prepares the browser assets in `public/data`, including:

- `lund-parks.geojson` for park geometry and attributes;
- `amenities.geojson` for mapped facility locations;
- `category-weights.json` for persona weights and radar-field mappings;
- supporting field-dictionary and analysis-metadata JSON files.

Amenity coordinates are converted from SWEREF 99 TM (`EPSG:3006`) to WGS 84 for Leaflet. Null source values remain unknown rather than being converted to zero. Regenerate the assets after replacing or updating the GeoPackage.

## Score presentation

- The underlying 0–100 source scores are preserved for filtering and details.
- Map colors are relative to the lowest and highest known values in the currently displayed result set: red is lower, yellow is the midpoint, and green is higher. Demographic priority is reversed because a lower adjusted index represents higher potential priority.
- Student, Family, and Elderly radar charts show each category's weighted contribution to its profile score. The General radar is a UI-derived, equal-weight comparison because the source does not provide six General category fields.
- Multiple amenity filters use AND logic: a matching park must satisfy every selected checkbox.

These transformations, assumptions, and current limitations are documented in [ASSUMPTIONS.md](ASSUMPTIONS.md). Additional export details are in [src/data/README.md](src/data/README.md).

## Important limitations

Scores and demographic priority are provisional model outputs for exploration, not verified accessibility claims, funding recommendations, or observations of park visitors. Amenity records reflect the source OpenStreetMap/GeoPackage snapshot and may be incomplete or outdated. The app does not calculate routes, travel time, live occupancy, maintenance condition, or observed usage.

OpenStreetMap background tiles require an internet connection in the browser.
