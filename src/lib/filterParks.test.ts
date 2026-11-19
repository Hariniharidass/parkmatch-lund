import { describe, expect, it } from 'vitest';
import { mockParks } from '../data/mockParks';
import { defaultFilters, filterParks } from './filterParks';

describe('filterParks', () => {
  it('combines active filters with AND logic', () => {
    const result = filterParks(mockParks, { ...defaultFilters, toilet:true, playground:true });
    expect(result.map((p) => p.id)).toEqual(['solglantan', 'vindspelet']);
  });
  it('treats unchecked checkboxes as any', () => expect(filterParks(mockParks, defaultFilters)).toHaveLength(mockParks.length));
  it('matches the selected radio category exactly', () => {
    expect(filterParks(mockParks, { ...defaultFilters, canopyCover:'high' }).map((p) => p.id)).toEqual(['linnea','hassel']);
  });
  it('does not match missing values to active requirements', () => {
    expect(filterParks(mockParks, { ...defaultFilters, waterTapAccess:true }).some((p) => p.id === 'norrsken')).toBe(false);
  });
  it('returns an empty result when no park meets all requirements', () => {
    expect(filterParks(mockParks, { ...defaultFilters, dogOffLeashArea:true, playground:true })).toEqual([]);
  });
});
