// Type declarations for react-leaflet
declare module 'react-leaflet' {
  import * as L from 'leaflet';
  import * as React from 'react';

  // Base component props
  interface BaseProps {
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
  }

  // MapContainer props
  interface MapContainerProps extends BaseProps {
    center: L.LatLngExpression;
    zoom: number;
    zoomControl?: boolean;
    scrollWheelZoom?: boolean;
    dragging?: boolean;
    doubleClickZoom?: boolean;
    maxBounds?: L.LatLngBoundsExpression;
    maxZoom?: number;
    minZoom?: number;
  }

  // TileLayer props
  interface TileLayerProps extends BaseProps {
    url: string;
    attribution?: string;
    maxZoom?: number;
    keepBuffer?: number;
    updateWhenIdle?: boolean;
    updateWhenZooming?: boolean;
    subdomains?: string;
  }

  // Marker props
  interface MarkerProps extends BaseProps {
    position: L.LatLngExpression;
    icon?: L.Icon;
    eventHandlers?: Record<string, (...args: any[]) => void>;
  }

  // Popup props
  interface PopupProps extends BaseProps {
    position?: L.LatLngExpression;
  }

  // Tooltip props
  interface TooltipProps extends BaseProps {
    direction?: string;
    offset?: number[];
    opacity?: number;
    permanent?: boolean;
  }

  // ZoomControl props
  interface ZoomControlProps extends BaseProps {
    position?: 'topleft' | 'topright' | 'bottomleft' | 'bottomright';
  }

  // Components
  export const MapContainer: React.FC<MapContainerProps>;
  export const TileLayer: React.FC<TileLayerProps>;
  export const Marker: React.FC<MarkerProps>;
  export const Popup: React.FC<PopupProps>;
  export const Tooltip: React.FC<TooltipProps>;
  export const ZoomControl: React.FC<ZoomControlProps>;
  
  // Hooks
  export function useMap(): L.Map;
  export function useMapEvents(events: Record<string, (...args: any[]) => void>): L.Map;
}

// Type declarations for leaflet
declare module 'leaflet' {
  export interface Map {
    setView(center: LatLngExpression, zoom: number, options?: ZoomPanOptions): this;
    setMinZoom(zoom: number): this;
    setMaxZoom(zoom: number): this;
    setMaxBounds(bounds: LatLngBoundsExpression): this;
    getMinZoom(): number;
    getZoom(): number;
    getCenter(): LatLng;
    stop(): this;
    panTo(latlng: LatLngExpression, options?: PanOptions): this;
    fitBounds(bounds: LatLngBoundsExpression): this;
    remove(): this;
    dragging: Handler;
    touchZoom: Handler;
    doubleClickZoom: Handler;
    scrollWheelZoom: Handler;
    boxZoom: Handler;
    keyboard: Handler;
    on(type: string, fn: (event: any) => void): this;
    off(type: string, fn: (event: any) => void): this;
  }

  export interface Handler {
    enable(): this;
    disable(): this;
  }

  export interface LatLng {
    lat: number;
    lng: number;
  }

  export interface LatLngBounds {
    getSouth(): number;
    getNorth(): number;
    getWest(): number;
    getEast(): number;
    getCenter(): LatLng;
    contains(point: LatLng): boolean;
    extend(point: LatLngExpression): this;
  }

  export interface ZoomPanOptions {
    animate?: boolean;
    duration?: number;
  }

  export interface PanOptions {
    animate?: boolean;
    duration?: number;
  }

  export interface MarkerOptions {
    icon?: Icon;
  }

  export type LatLngExpression = LatLng | [number, number] | { lat: number; lng: number };
  export type LatLngBoundsExpression = LatLngBounds | LatLngExpression[] | [[number, number], [number, number]];

  export function map(element: HTMLElement, options?: any): Map;
  export function latLng(lat: number, lng: number): LatLng;
  export function latLngBounds(a: LatLngExpression, b: LatLngExpression): LatLngBounds;
  export function icon(options: any): Icon;

  export interface Icon {
    options: {
      iconUrl: string;
      shadowUrl?: string;
      iconSize?: [number, number];
      iconAnchor?: [number, number];
    }
  }

  export class Marker {
    static prototype: {
      options: {
        icon: Icon;
      }
    };
  }
} 