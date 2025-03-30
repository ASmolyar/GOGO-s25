/**
 * Types for the Map component
 */

export type LocationType = 
  | 'school' 
  | 'community-center' 
  | 'studio' 
  | 'academy' 
  | 'hub' 
  | 'program' 
  | 'office'
  | 'summer-program'
  | 'default';

export interface Sublocation {
  id: string;
  name: string;
  coordinates: [number, number]; // [latitude, longitude]
  type?: LocationType;
  programs?: string[];
  supportedBy?: string[];
  description?: string;
  address?: string;
  website?: string;
  contactInfo?: string;
  image?: string;
}

export interface Region {
  id: string;
  name: string;
  centerCoordinates: [number, number]; // [latitude, longitude]
  defaultZoom: number;
  minZoom?: number;
  maxZoom?: number;
  maxBounds?: [[number, number], [number, number]]; // [[southWest], [northEast]]
  color?: string;
  sublocations: Sublocation[];
  description?: string;
} 