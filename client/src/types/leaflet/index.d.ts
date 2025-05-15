declare module 'leaflet' {
  export type LatLngExpression =
    | [number, number]
    | { lat: number; lng: number }
    | { lat: number; lon: number };

  export interface MapOptions {
    center?: LatLngExpression;
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    maxBounds?: LatLngBounds;
    attributionControl?: boolean;
    zoomControl?: boolean;
    scrollWheelZoom?: boolean | string;
    touchZoom?: boolean | string;
    doubleClickZoom?: boolean | string;
  }

  export class LatLngBounds {
    constructor(southWest: LatLngExpression, northEast: LatLngExpression);
    static extend(bounds: LatLngBounds | LatLngExpression[]): LatLngBounds;
  }
}
