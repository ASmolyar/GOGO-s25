declare module 'react-leaflet' {
  import { FC, ReactNode } from 'react';
  import { LatLngExpression, MapOptions, LatLngBounds } from 'leaflet';

  export interface MapContainerProps extends MapOptions {
    center: LatLngExpression;
    zoom: number;
    children?: ReactNode;
    className?: string;
    style?: React.CSSProperties;
    bounds?: LatLngBounds;
    whenCreated?: (map: any) => void;
  }

  export const MapContainer: FC<MapContainerProps>;

  export interface TileLayerProps {
    attribution?: string;
    url: string;
    children?: ReactNode;
  }

  export const TileLayer: FC<TileLayerProps>;

  export interface MarkerProps {
    position: LatLngExpression;
    children?: ReactNode;
  }

  export const Marker: FC<MarkerProps>;

  export interface PopupProps {
    children?: ReactNode;
  }

  export const Popup: FC<PopupProps>;

  export interface CircleProps {
    center: LatLngExpression;
    radius: number;
    children?: ReactNode;
  }

  export const Circle: FC<CircleProps>;

  export interface PolygonProps {
    positions: LatLngExpression[] | LatLngExpression[][];
    children?: ReactNode;
  }

  export const Polygon: FC<PolygonProps>;

  export const useMap: () => any;
}
