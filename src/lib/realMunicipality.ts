import type { CategoryWeight, InvestigationSort, MunicipalityRealFilters, Persona, RealParkFeature } from '../types/municipality';

export const personaOptions = [{id:'young' as const,label:'Student'},{id:'family' as const,label:'Family'},{id:'pensioner' as const,label:'Elderly'}];
export const defaultRealFilters:MunicipalityRealFilters={minScore:0,maxScore:100,evidence:'all',demographics:'all'};
export const scoreField=(persona:Persona)=>`${persona}_score`;
export const coverageField=(persona:Persona)=>`${persona}_coverage_pct`;
export const incompleteField=(persona:Persona)=>`${persona}_is_incomplete`;
export const provisionalField=(persona:Persona)=>`${persona}_is_provisional`;
export const parkName=(park:RealParkFeature)=>park.properties.name?.trim()||`Unnamed park — ${park.properties.park_id}`;
export const valueFor=(park:RealParkFeature,field:string):number|null=>{const value=park.properties[field];return typeof value==='number'&&Number.isFinite(value)?value:null};
export const booleanFor=(park:RealParkFeature,field:string):boolean=>park.properties[field]===true||park.properties[field]===1;
export function filterRealParks(parks:RealParkFeature[],persona:Persona,filters:MunicipalityRealFilters){return parks.filter(park=>{const score=valueFor(park,scoreField(persona));if(score===null&&(filters.minScore!==0||filters.maxScore!==100))return false;if(score!==null&&(score<filters.minScore||score>filters.maxScore))return false;const incomplete=booleanFor(park,incompleteField(persona));if(filters.evidence==='complete'&&incomplete)return false;if(filters.evidence==='incomplete'&&!incomplete)return false;const hasDemographics=park.properties.demographic_status!==null&&park.properties.demographic_status!=='unknown_no_represented_population';if(filters.demographics==='available'&&!hasDemographics)return false;if(filters.demographics==='unknown'&&hasDemographics)return false;return true;});}
export function realDatasetSummary(parks:RealParkFeature[],persona:Persona){const scores=parks.map(p=>valueFor(p,scoreField(persona))).filter((v):v is number=>v!==null);const demographicAvailable=parks.filter(p=>p.properties.demographic_status!==null&&p.properties.demographic_status!=='unknown_no_represented_population').length;return{total:parks.length,average:scores.length?scores.reduce((a,b)=>a+b,0)/scores.length:null,incomplete:parks.filter(p=>booleanFor(p,incompleteField(persona))).length,demographicAvailable,demographicUnknown:parks.length-demographicAvailable};}
export const weightsFor=(weights:CategoryWeight[],persona:Persona)=>weights.filter(w=>w.persona===persona).sort((a,b)=>a.spider_order-b.spider_order);
export const scoreColor=(score:number|null)=>score===null?'#9aa69f':score<25?'#a63d40':score<50?'#d98545':score<75?'#c2a83e':'#357a55';
export const formatNumber=(value:number|null,digits=1)=>value===null?'Data unavailable':value.toLocaleString(undefined,{maximumFractionDigits:digits});
export function sortInvestigationParks(parks:RealParkFeature[],persona:Persona,sort:InvestigationSort){return [...parks].sort((a,b)=>{if(sort==='name')return parkName(a).localeCompare(parkName(b));if(sort==='score'){const av=valueFor(a,scoreField(persona)),bv=valueFor(b,scoreField(persona));return av===null?1:bv===null?-1:bv-av;}const av=a.properties.demographic_priority_rank,bv=b.properties.demographic_priority_rank;return av===null?1:bv===null?-1:av-bv;});}
