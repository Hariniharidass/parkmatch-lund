import type { MunicipalityFilters, Park } from '../types/park';

export const defaultMunicipalityFilters: MunicipalityFilters = {
  noBench:false, noToilet:false, noWaterTapAccess:false, noWheelchairAccessible:false,
  noPlayground:false, noPublicSportPark:false, noFootballSportCourts:false,
  noDogOffLeashArea:false, noCrossings:false, noTrafficLight:false,
  noStreetParkLight:false, noFencedArea:false, canopyCover:'any',
  grassCover:'any', publicAccess:'any'
};
const absencePairs = [['noBench','bench'],['noToilet','toilet'],['noWaterTapAccess','waterTapAccess'],['noWheelchairAccessible','wheelchairAccessible'],['noPlayground','playground'],['noPublicSportPark','publicSportPark'],['noFootballSportCourts','footballSportCourts'],['noDogOffLeashArea','dogOffLeashArea'],['noCrossings','crossings'],['noTrafficLight','trafficLight'],['noStreetParkLight','streetParkLight'],['noFencedArea','fencedArea']] as const;
export function filterMunicipalityParks(parks:Park[], f:MunicipalityFilters):Park[] { return parks.filter(p => absencePairs.every(([fk,pk])=>!f[fk]||p[pk]===false) && (f.canopyCover==='any'||p.canopyCover===f.canopyCover) && (f.grassCover==='any'||p.grassCover===f.grassCover) && (f.publicAccess==='any'||p.publicAccess===f.publicAccess)); }
export const municipalityFilterCount=(f:MunicipalityFilters)=>absencePairs.filter(([k])=>f[k]).length+Number(f.canopyCover!=='any')+Number(f.grassCover!=='any')+Number(f.publicAccess!=='any');
export const coverDistribution=(parks:Park[],key:'canopyCover'|'grassCover')=>(['low','mid','high','unknown'] as const).map(label=>({label,count:parks.filter(p=>label==='unknown'?p[key]===null:p[key]===label).length}));
export const facilityAvailability=(parks:Park[])=>[['Benches','bench'],['Toilets','toilet'],['Water taps','waterTapAccess'],['Playgrounds','playground'],['Wheelchair access','wheelchairAccessible'],['Lighting','streetParkLight']].map(([label,key])=>({label,count:parks.filter(p=>p[key as keyof Park]===true).length}));
export const datasetSummary=(parks:Park[])=>({total:parks.length,withoutRecordedToilets:parks.filter(p=>p.toilet!==true).length,lowCanopy:parks.filter(p=>p.canopyCover==='low').length,withoutRecordedWheelchairAccess:parks.filter(p=>p.wheelchairAccessible!==true).length,restrictedAccess:parks.filter(p=>p.publicAccess==='restricted').length});
export function observations(p:Park):string[]{const r:string[]=[];const add=(c:boolean,t:string)=>{if(c)r.push(t)};add(p.toilet===false,'No recorded toilet');add(p.canopyCover==='low','Low canopy cover');add(p.wheelchairAccessible!==true,'Wheelchair accessibility not recorded as available');add(p.publicAccess==='restricted','Restricted public access');add(p.waterTapAccess===false,'No recorded water tap');add(p.streetParkLight===false,'No recorded street / park lighting');return r;}
