import type { Park, ParkFilters } from '../types/park';

export const defaultFilters: ParkFilters = {
  bench:false, toilet:false, waterTapAccess:false, playground:false,
  publicSportPark:false, footballSportCourts:false, dogOffLeashArea:false,
  canopyCover:'any', grassCover:'any', wheelchairAccessible:false,
  crossings:false, trafficLight:false, publicAccess:'any',
  streetParkLight:false, fencedArea:false
};

const booleanKeys = ['bench','toilet','waterTapAccess','playground','publicSportPark','footballSportCourts','dogOffLeashArea','wheelchairAccessible','crossings','trafficLight','streetParkLight','fencedArea'] as const;

export function parkMatchesFilters(park: Park, filters: ParkFilters): boolean {
  if (!booleanKeys.every((key) => !filters[key] || park[key] === true)) return false;
  if (filters.canopyCover !== 'any' && park.canopyCover !== filters.canopyCover) return false;
  if (filters.grassCover !== 'any' && park.grassCover !== filters.grassCover) return false;
  if (filters.publicAccess !== 'any' && park.publicAccess !== filters.publicAccess) return false;
  return true;
}

export const filterParks = (parks: Park[], filters: ParkFilters): Park[] => parks.filter((park) => parkMatchesFilters(park, filters));

export const activeFilterCount = (filters: ParkFilters): number =>
  booleanKeys.filter((key) => filters[key]).length +
  Number(filters.canopyCover !== 'any') + Number(filters.grassCover !== 'any') + Number(filters.publicAccess !== 'any');
