import {describe,expect,it} from 'vitest';
import {activeConsumerFilterCount,defaultConsumerFilters,filterConsumerParks} from './consumerReal';
import type {RealParkFeature} from '../types/municipality';

const park=(id:string,bench:number|null,toilet:number|null)=>({type:'Feature',geometry:{type:'Polygon',coordinates:[]},properties:{park_id:id,bench_count:bench,toilet_count:toilet}}) as unknown as RealParkFeature;

describe('real consumer amenity filtering',()=>{
 const parks=[park('a',2,0),park('b',1,1),park('c',null,1)];
 it('defaults every amenity to unchecked',()=>{const filters=defaultConsumerFilters();expect(activeConsumerFilterCount(filters)).toBe(0);expect(filterConsumerParks(parks,filters)).toHaveLength(3)});
 it('requires a checked amenity to be present',()=>expect(filterConsumerParks(parks,{bench_count:true}).map(p=>p.properties.park_id)).toEqual(['a','b']));
 it('combines checked amenities with AND logic',()=>expect(filterConsumerParks(parks,{bench_count:true,toilet_count:true}).map(p=>p.properties.park_id)).toEqual(['b']));
 it('does not treat a missing value as present',()=>expect(filterConsumerParks(parks,{bench_count:true}).map(p=>p.properties.park_id)).not.toContain('c'));
});
