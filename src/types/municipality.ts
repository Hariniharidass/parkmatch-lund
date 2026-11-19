export type Persona = 'young' | 'family' | 'pensioner';
export type EvidenceFilter = 'all' | 'complete' | 'incomplete';
export type DemographicFilter = 'all' | 'available' | 'unknown';
export type InvestigationSort = 'priority' | 'score' | 'name';

export interface RealParkProperties {
  park_id: string; name: string | null; area_ha: number | null; general_score: number | null; general_coverage_pct: number | null;
  family_score: number | null; family_coverage_pct: number | null; family_is_incomplete: boolean; family_is_provisional: boolean;
  young_score: number | null; young_coverage_pct: number | null; young_is_incomplete: boolean; young_is_provisional: boolean;
  pensioner_score: number | null; pensioner_coverage_pct: number | null; pensioner_is_incomplete: boolean; pensioner_is_provisional: boolean;
  catchment_population: number | null; catchment_cells: number | null; catchment_deso_count: number | null; demographic_status: string | null;
  family_age_share_pct: number | null; young_age_share_pct: number | null; pensioner_age_share_pct: number | null; age_groups_share_pct: number | null;
  family_estimated_population: number | null; young_estimated_population: number | null; pensioner_estimated_population: number | null;
  family_gap_points: number | null; young_gap_points: number | null; pensioner_gap_points: number | null; age_weighted_quality: number | null;
  demographic_priority_points: number | null; demographic_adjusted_index: number | null; demographic_priority_rank: number | null;
  [key: string]: string | number | boolean | null;
}
export interface PolygonGeometry { type:'Polygon'|'MultiPolygon'; coordinates: unknown[]; }
export interface RealParkFeature { type:'Feature'; geometry:PolygonGeometry; properties:RealParkProperties; }
export interface RealParkCollection { type:'FeatureCollection'; features:RealParkFeature[]; }
export interface CategoryWeight { persona:Persona; category:string; label:string; spider_order:number; overall_weight_pct:number; score_field:string; coverage_field:string; }
export interface CategoryWeightFeature { type:'Feature'; geometry:null; properties:CategoryWeight; }
export interface CategoryWeightCollection { type:'FeatureCollection'; features:CategoryWeightFeature[]; }
export interface MunicipalityRealFilters { minScore:number; maxScore:number; evidence:EvidenceFilter; demographics:DemographicFilter; }
