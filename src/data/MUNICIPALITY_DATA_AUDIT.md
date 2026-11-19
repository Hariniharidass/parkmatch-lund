# Municipality data/UI audit

Audited against `lund_parks_personas_demographics.gpkg` and the supplied “Lund park scores and local demographics” guide.

## UI coverage

| GeoPackage fields | UI status |
| --- | --- |
| `park_id`, `name`, `geom`, `area_ha` | Implemented: selection key/fallback name, polygon map, and selected-park area. |
| `general_score`, `general_coverage_pct` | Implemented as a separate General Quality block. |
| `family_score`, `young_score`, `pensioner_score` | Implemented through the Family, Student, and Elderly selector. Higher is explicitly labelled better. |
| Persona `*_coverage_pct`, `*_is_incomplete`, `*_is_provisional` | Implemented in summary, filters, evidence labels, and warnings. |
| All 18 persona/category `*_score` fields | Implemented in the six-axis chart and category disclosure. |
| All 18 category `*_coverage_pct` fields | Implemented in the category disclosure. |
| `catchment_population`, `catchment_cells`, `catchment_deso_count` | Implemented in park context and Detailed demographic analysis. |
| `demographic_status` | Implemented through demographic availability filtering and dataset summary; technical status text is intentionally not duplicated in the selected-park cards. |
| `family_age_share_pct`, `young_age_share_pct`, `pensioner_age_share_pct`, `age_groups_share_pct` | Implemented in park context and detailed analysis. |
| `family_estimated_population`, `young_estimated_population`, `pensioner_estimated_population` | Implemented in Detailed demographic analysis. |
| `family_gap_points`, `young_gap_points`, `pensioner_gap_points` | Implemented in Detailed demographic analysis. |
| `age_weighted_quality` | Implemented; higher is labelled better modelled quality for the selected age mix. |
| `demographic_priority_points`, `demographic_adjusted_index`, `demographic_priority_rank` | Implemented. Rank 1 is labelled greatest potential priority. |

No documented `parks` data field remains absent from the applicable UI, except that non-selected persona values are intentionally accessed through the persona selector rather than displayed simultaneously.

## Intentionally metadata-only

- `field_dictionary` descriptions, source-table names, and original source-field names remain integration documentation rather than repeated UI content.
- `analysis_metadata` source SHA-256 fingerprints and internal formula strings remain metadata-only.
- Data years and full model caveat text remain in exported metadata/documentation; the UI presents the operational caveats, provisional status, and 300 m straight-line interpretation.
- `category_weights.category` and raw field-name strings drive the chart but are not exposed as technical UI labels. Labels, order, weights, score fields, and coverage fields are read from the table export.

## Verification findings

- Source and export both contain 172 features with 172 unique `park_id` values.
- All geometries are valid polygons. Export bounds are 13.1462506–13.2527333 longitude and 55.6814924–55.7382465 latitude.
- A field-by-field comparison found zero mismatches for persona/general scores, all category scores and coverage, and demographic/priority fields.
- All 18 exported weight records match the GeoPackage for label, `spider_order`, precise weight, score field, and coverage field.
- Vindarnas Park and Reflektionen retain `unknown_no_represented_population`; their combined demographic quality/priority/rank fields remain `null`. Their source `catchment_population` is genuinely numeric zero and is not a substituted null value.
