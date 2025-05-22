import React, { useEffect, useRef, useMemo } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { Region } from './types';

interface MapControllerProps {
  center: [number, number];
  zoom: number;
  region?: Region & {
    optimalView?: {
      center: [number, number];
      zoom: number;
      minZoom: number;
      bounds: L.LatLngBounds;
      visualBounds: L.LatLngBounds;
    };
  };
  defaultMaxBounds?: [[number, number], [number, number]];
  fitToMarkers?: boolean;
  onExitRegion?: () => void;
  lastRegionCoordinates?: [number, number];
}

// Constants for USA overview map settings
const USA_MIN_ZOOM = 4;
const USA_MAX_ZOOM = 4;

// US overview default bounds
const USA_BOUNDS: [[number, number], [number, number]] = [
  [24.396308, -125.0], // Southwest corner of US
  [49.384358, -66.93457], // Northeast corner of US
];

// Component to set the map bounds and view with region-based bounds control
function MapController({
  center,
  zoom,
  region,
  defaultMaxBounds = USA_BOUNDS,
  fitToMarkers = false,
  onExitRegion,
  lastRegionCoordinates,
}: MapControllerProps) {
  const map = useMap();
  const isTransitioning = useRef(false);

  // Calculate view settings based on region or default values
  const viewSettings = useMemo(() => {
    if (region?.optimalView) {
      return {
        center: region.optimalView.center,
        zoom: region.optimalView.zoom,
        minZoom: region.optimalView.minZoom,
        bounds: region.optimalView.bounds,
        visualBounds: region.optimalView.visualBounds,
      };
    }

    // Default to USA overview settings
    return {
      center: lastRegionCoordinates || center,
      zoom,
      minZoom: USA_MIN_ZOOM,
      bounds: L.latLngBounds(
        L.latLng(defaultMaxBounds[0][0], defaultMaxBounds[0][1]),
        L.latLng(defaultMaxBounds[1][0], defaultMaxBounds[1][1]),
      ),
    };
  }, [region, center, zoom, defaultMaxBounds, lastRegionCoordinates]);

  // Set up map when region changes
  useEffect(() => {
    // Only proceed if map is available
    if (map) {
      // For region view
      if (region) {
        map.setView(viewSettings.center, viewSettings.zoom, {
          animate: true,
          duration: 1.0,
        });
        map.setMinZoom(viewSettings.minZoom);
        map.setMaxZoom(16);

        if (viewSettings.bounds) {
          map.setMaxBounds(viewSettings.bounds);
        }
      } else {
        // For USA overview
        map.setView(viewSettings.center, viewSettings.zoom, {
          animate: true,
          duration: 1.0,
        });
        map.setMinZoom(USA_MIN_ZOOM);
        map.setMaxZoom(USA_MAX_ZOOM);

        if (viewSettings.bounds) {
          map.setMaxBounds(viewSettings.bounds);
        }
      }
    }

    // Clean up event listeners when component unmounts
    return () => {
      if (map && map.off) {
        // Use a no-op function that satisfies TypeScript typing
        const noop = () => {}; // eslint-disable-line @typescript-eslint/no-empty-function

        // Remove specific event listeners
        map.off('moveend', noop);
        map.off('zoomend', noop);
      }
    };
  }, [map, region, viewSettings]);

  return null;
}

export default MapController;
