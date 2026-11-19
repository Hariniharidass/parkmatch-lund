export type Level = 'low' | 'mid' | 'high';
export type PublicAccess = 'anytime' | 'restricted';
export type KnownBoolean = boolean | null;

export interface Park {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  bench: KnownBoolean;
  toilet: KnownBoolean;
  waterTapAccess: KnownBoolean;
  playground: KnownBoolean;
  publicSportPark: KnownBoolean;
  footballSportCourts: KnownBoolean;
  dogOffLeashArea: KnownBoolean;
  canopyCover: Level | null;
  grassCover: Level | null;
  wheelchairAccessible: KnownBoolean;
  crossings: KnownBoolean;
  trafficLight: KnownBoolean;
  publicAccess: PublicAccess | null;
  streetParkLight: KnownBoolean;
  fencedArea: KnownBoolean;
  description?: string;
}

export interface ParkFilters {
  bench: boolean;
  toilet: boolean;
  waterTapAccess: boolean;
  playground: boolean;
  publicSportPark: boolean;
  footballSportCourts: boolean;
  dogOffLeashArea: boolean;
  canopyCover: Level | 'any';
  grassCover: Level | 'any';
  wheelchairAccessible: boolean;
  crossings: boolean;
  trafficLight: boolean;
  publicAccess: PublicAccess | 'any';
  streetParkLight: boolean;
  fencedArea: boolean;
}

export interface MunicipalityFilters {
  noBench: boolean; noToilet: boolean; noWaterTapAccess: boolean;
  noWheelchairAccessible: boolean; noPlayground: boolean; noPublicSportPark: boolean;
  noFootballSportCourts: boolean; noDogOffLeashArea: boolean; noCrossings: boolean;
  noTrafficLight: boolean; noStreetParkLight: boolean; noFencedArea: boolean;
  canopyCover: Level | 'any'; grassCover: Level | 'any';
  publicAccess: PublicAccess | 'any';
}
