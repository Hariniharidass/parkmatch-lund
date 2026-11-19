import type {CategoryWeight,RealParkFeature} from '../types/municipality';
import {valueFor} from './realMunicipality';

export type ConsumerCategoryFilters=Record<string,number|null>;
export const defaultConsumerFilters=(weights:CategoryWeight[]):ConsumerCategoryFilters=>Object.fromEntries(weights.map(w=>[w.category,null]));
export function filterConsumerParks(parks:RealParkFeature[],weights:CategoryWeight[],filters:ConsumerCategoryFilters){return parks.filter(park=>weights.every(weight=>{const minimum=filters[weight.category];return minimum===null||minimum===undefined||(valueFor(park,weight.score_field)!==null&&valueFor(park,weight.score_field)!>=minimum)}));}
export const activeConsumerFilterCount=(filters:ConsumerCategoryFilters)=>Object.values(filters).filter(v=>v!==null).length;
