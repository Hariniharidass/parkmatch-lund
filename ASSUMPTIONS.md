# UI data assumptions and transformations

This document records transformations and presentation decisions applied between `data/lund_parks_personas_demographics.gpkg` and the web interface. It distinguishes original values from values derived only for display.

## GeoPackage export

- `scripts/export_gpkg.py` is the repeatable source-to-UI conversion step.
- Existing park polygon geometry in `public/data/lund-parks.geojson` is retained. Park properties are replaced with the matching `parks` row from the GeoPackage using `park_id`.
- The GeoPackage `amenities` point layer is exported to `public/data/amenities.geojson`.
- Amenity coordinates are converted from SWEREF 99 TM (`EPSG:3006`) to WGS 84 longitude/latitude for Leaflet.
- Pipe- or comma-separated `park_ids` are converted into arrays. An amenity linked to multiple parks is shown for each linked park; the point itself is not duplicated in the exported feature collection.
- `category_weights` is exported without changing its weights, labels, score fields, coverage fields, or spider order.
- Null values remain null. They are not converted to zero in exported park data.

## Park score colors

- The original scores are not changed or stored as normalized values.
- Map colors are normalized at render time against the lowest and highest known score among the parks currently displayed:
  - lowest displayed score = red;
  - midpoint of the displayed range = yellow;
  - highest displayed score = green;
  - unknown score = grey.
- Values are linearly interpolated between the endpoints and clamped to the displayed range.
- If every displayed park has the same score, all receive the midpoint color.
- Because the range is recalculated after filtering or changing persona, the same numeric score can have a different color in a different visible result set. The legend displays the current numeric minimum, midpoint, and maximum.

## Persona radar chart

- Student, Family, and Elderly use their original six persona category scores and original `overall_weight_pct` values.
- The selected-persona radar displays **contribution points**, calculated per axis as:

  `category score × category weight / 100`

- This weighted view is used because raw persona category scores differ by only about 5.7 points per axis on average and therefore produced nearly identical shapes on a fixed 0–100 chart.
- The contribution chart uses a 0–25 radial scale because the largest configured category weight is below 25%. Exact raw category scores, weights, and coverage remain visible below the chart and in chart tooltips.
- A category with zero persona weight is plotted at zero contribution even when its raw category score is non-zero.

## General radar profile

- The GeoPackage contains `general_score` and `general_coverage_pct`, but it does not contain six `general_*_score` category fields.
- The General radar is therefore a UI-derived comparison profile, not the calculation behind `general_score`.
- Each General radar category score is the arithmetic mean of the available Student, Family, and Elderly score for that category.
- General radar categories receive equal weights (`100 / 6` percent each) when converted to contribution points.
- The General headline and map color continue to use the original GeoPackage `general_score`; they are not recalculated from the derived radar.

## Find-a-Park amenity filters

- Score sliders were replaced by concrete checkboxes based on GeoPackage count and cover fields.
- Multiple checked filters use AND logic: a park must satisfy every checked option.
- A count-based amenity matches only when its corresponding `*_count` value is greater than zero.
- Tree, water, and vegetation cover are characteristics rather than point amenities. They are included under Climate adaptation and match when the corresponding cover percentage is greater than zero.
- Null and zero values do not match an active checkbox.
- When filters change, the map fits to the bounds of the matching parks. Matching polygons receive a stronger outline and opacity; the selected park receives an orange outline.

## Municipality controls

- Evidence-completeness and demographic-availability filters were removed from the municipality left panel; their underlying fields remain available in the exported data and summary/detail displays.
- The municipality left panel retains the selected profile and score-range controls.
- The selected park's Mapped facilities section is shown in the left panel. It is informational and does not filter municipality results.

## Demographic priority map

- Municipality demographic-priority colors use the original `demographic_adjusted_index` field.
- A lower adjusted index means higher potential priority and is shown in red; a higher index means lower priority and is shown in green.
- Colors are normalized to the lowest and highest known adjusted index in the currently displayed result set. Unknown indices remain grey.
- The map mode can switch between demographic priority and the selected profile quality score; this changes presentation only and does not rewrite either value.
- Selecting an investigation card focuses the map on that park and exposes coordinated context: facility counts in the left panel, detailed scores and priority fields in the right panel, and amenity locations on the map. The center panel avoids duplicating those details.

## Amenity counts and locations

- Counts shown in the municipality left-panel facility summary come directly from the GeoPackage park count fields.
- Amenity markers use the point coordinates and park links from the GeoPackage.
- On both maps, markers are shown for the selected park to avoid rendering all 1,031 points simultaneously over the city view.
- Marker symbols are selected from the amenity `category` value for visual recognition. The symbols are a UI representation and do not alter the underlying OpenStreetMap tags or GeoPackage records.
- Both maps fit to changed result bounds, use strong dark outlines for results, and use an orange outline for the selected park.

## Interpretation

- Scores and coverage are presented as provisional model outputs, not verified statements about accessibility, quality, or facility availability.
- Nearby demographics describe modelled 300 m straight-line catchments and are not observations of park visitors.
- Relative map colors communicate ranking within the current visible set, not an absolute quality threshold.
