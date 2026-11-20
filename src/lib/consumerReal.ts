import type {RealParkFeature} from '../types/municipality';
import {valueFor} from './realMunicipality';

export interface AmenityFilterDefinition { field:string;label:string; }
export type ConsumerCategoryFilters=Record<string,boolean>;

export const amenityFiltersByCategory:Record<string,AmenityFilterDefinition[]>={
 community:[
  {field:'picnic_table_count',label:'Picnic tables'},
  {field:'performance_spaces_count',label:'Performance spaces'},
  {field:'food_and_drink_count',label:'Food & drink'},
  {field:'picnic_sites_count',label:'Picnic sites'},
  {field:'outdoor_cooking_count',label:'Outdoor cooking / BBQ'},
 ],
 sport_movement:[
  {field:'playground_count',label:'Playgrounds'},
  {field:'sports_pitch_count',label:'Sports pitches'},
  {field:'fitness_station_count',label:'Fitness stations'},
  {field:'sports_centres_count',label:'Sports centres'},
  {field:'swimming_pools_count',label:'Swimming pools'},
  {field:'disc_golf_count',label:'Disc golf'},
 ],
 amenities:[
  {field:'toilet_count',label:'Toilets'},
  {field:'drinking_water_count',label:'Drinking water'},
  {field:'waste_bin_count',label:'Waste bins'},
  {field:'bicycle_parking_count',label:'Bicycle parking'},
  {field:'bike_services_count',label:'Bicycle services'},
 ],
 rest_comfort:[
  {field:'bench_count',label:'Benches'},
  {field:'shelter_count',label:'Shelters'},
 ],
 accessibility:[
  {field:'information_count',label:'Information points'},
 ],
 climate_adaptation:[
  {field:'tree_cover_pct',label:'Tree cover'},
  {field:'water_cover_pct',label:'Water cover'},
  {field:'vegetation_cover_pct',label:'Vegetation cover'},
 ],
};

const allDefinitions=()=>Object.values(amenityFiltersByCategory).flat();
export const defaultConsumerFilters=():ConsumerCategoryFilters=>Object.fromEntries(allDefinitions().map(item=>[item.field,false]));
export function filterConsumerParks(parks:RealParkFeature[],filters:ConsumerCategoryFilters){
 const active=allDefinitions().filter(item=>filters[item.field]);
 return parks.filter(park=>active.every(item=>(valueFor(park,item.field)??0)>0));
}
export const activeConsumerFilterCount=(filters:ConsumerCategoryFilters)=>Object.values(filters).filter(Boolean).length;
