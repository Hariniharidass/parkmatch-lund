import { describe,expect,it } from 'vitest'; import { mockParks } from '../data/mockParks'; import { coverDistribution,datasetSummary,defaultMunicipalityFilters,filterMunicipalityParks,observations } from './municipality';
describe('municipality utilities',()=>{
 it('combines filters with AND logic',()=>expect(filterMunicipalityParks(mockParks,{...defaultMunicipalityFilters,noToilet:true,canopyCover:'low'}).map(p=>p.id)).toEqual(['aker']));
 it('keeps unknown separate from confirmed absence',()=>expect(filterMunicipalityParks(mockParks,{...defaultMunicipalityFilters,noToilet:true}).some(p=>p.toilet===null)).toBe(false));
 it('calculates dynamic cover distributions',()=>expect(coverDistribution(mockParks,'canopyCover').reduce((n,x)=>n+x.count,0)).toBe(mockParks.length));
 it('derives observations',()=>expect(observations(mockParks.find(p=>p.id==='saga')!)).toContain('Restricted public access'));
 it('calculates overview cards from the complete supplied dataset',()=>{const filtered=filterMunicipalityParks(mockParks,{...defaultMunicipalityFilters,noToilet:true});expect(datasetSummary(mockParks).total).toBe(mockParks.length);expect(datasetSummary(mockParks).total).not.toBe(filtered.length);});
});
