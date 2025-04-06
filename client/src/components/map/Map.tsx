import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  ZoomControl,
  useMapEvents,
  Tooltip,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styled from 'styled-components';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import COLORS from '../../assets/colors.ts';
import { Region, Sublocation } from './types';
import { createMarkerIcon, createRegionIcon } from './utils/markers';
import MapController from './MapController';

// Fix for Leaflet default icon issues in React
// This is needed because Leaflet's default icon paths are based on the page location
// but in React, the paths are different

// Fix Leaflet's default icon
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Using type assertion with specific interface
(L.Marker.prototype as unknown as { options: { icon: L.Icon } }).options.icon =
  DefaultIcon;

// Custom styled component for the map container
const StyledMapContainer = styled(MapContainer)<{
  isRegionSelected: boolean;
  regionColor?: string;
}>`
  height: 0;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  position: relative;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  border: 2px solid ${COLORS.gogo_purple};
  background-color: #1a1a1e;
  overflow: hidden;

  /* Position the map content to fill the container */
  .leaflet-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: ${(props) =>
      props.isRegionSelected ? 'grab' : 'default'} !important;
    font-family: 'HK Grotesk', sans-serif;
  }

  /* Change cursor when actively panning */
  .leaflet-container.leaflet-drag-target {
    cursor: grabbing !important;
  }

  /* Add a subtle transition for the cursor to make it feel responsive */
  .leaflet-container {
    transition: cursor 0.15s;
  }

  /* Hide zoom controls since we're using our own control system */
  .leaflet-control-zoom {
    display: none !important;
  }

  /* Enhance attribution control */
  .leaflet-control-attribution {
    background: rgba(10, 10, 15, 0.7) !important;
    color: rgba(255, 255, 255, 0.7) !important;
    font-size: 10px !important;
    padding: 3px 8px !important;
    border-radius: 4px 0 0 0 !important;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);

    a {
      color: ${(props) => props.regionColor || COLORS.gogo_blue} !important;
      transition: color 0.2s;

      &:hover {
        color: ${COLORS.gogo_yellow} !important;
        text-decoration: none !important;
      }
    }
  }

  /* Custom styling for popups */
  .leaflet-popup {
    margin-bottom: 15px;
  }

  .leaflet-popup-content-wrapper {
    background: rgba(26, 26, 30, 0.95);
    border-radius: 10px;
    color: white;
    border: 1px solid ${(props) => props.regionColor || COLORS.gogo_blue};
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
    overflow: hidden;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    transition: transform 0.2s ease;
    transform: scale(0.95);
    animation: popup-appear 0.3s forwards;

    @keyframes popup-appear {
      from {
        transform: scale(0.9);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }
  }

  .leaflet-popup-content {
    margin: 12px 16px;
    line-height: 1.4;
    font-size: 14px;
  }

  .leaflet-popup-tip {
    background: ${(props) => props.regionColor || COLORS.gogo_blue};
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }

  .leaflet-popup-close-button {
    color: ${(props) => props.regionColor || COLORS.gogo_blue} !important;
    opacity: 0.8;
    transition: all 0.2s;
    font-size: 20px !important;
    font-weight: bold;

    &:hover {
      color: ${COLORS.gogo_yellow} !important;
      opacity: 1;
      background: none !important;
    }
  }

  /* Custom styling for tooltips */
  .leaflet-tooltip {
    background: rgba(26, 26, 30, 0.9);
    color: white;
    border: 1px solid ${(props) => props.regionColor || COLORS.gogo_blue};
    border-radius: 6px;
    font-weight: bold;
    padding: 6px 12px;
    font-size: 14px;
    text-align: center;
    white-space: nowrap;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    transition: transform 0.15s ease, opacity 0.15s ease;
    transform-origin: bottom center;

    &:before {
      display: none; /* Remove default arrow */
    }
  }

  /* Marker styles */
  .custom-marker,
  .custom-region-marker {
    transition: transform 0.2s ease;

    &:hover {
      z-index: 1000 !important;

      /* Slightly scale up markers on hover */
      transform: scale(1.1);

      /* Show pulse effect on hover */
      .marker-pulse {
        opacity: 1;
      }
    }
  }

  /* Hide marker pulse by default, show on hover */
  .marker-pulse {
    opacity: 0;
    transition: opacity 0.3s;
  }

  /* Add a subtle shadow to the map tiles */
  .leaflet-tile {
    filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.2));
  }

  /* Fade out tiles during zoom for smoother transitions */
  .leaflet-fade-anim .leaflet-tile {
    will-change: opacity;
    transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .leaflet-zoom-anim {
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform;
  }
`;

// Custom style for the map tiles to match the purple/blue color scheme
const purpleMapStyle = {
  url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}{r}.png',
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  subdomains: 'abcd',
  maxZoom: 19,
};

// Constants for USA overview map settings
const USA_MAP_CENTER: [number, number] = [39.8283, -98.5795]; // Center of US
const USA_MAX_ZOOM = 4; // Fixed zoom level for USA overview
const USA_MIN_ZOOM = 4; // Fixed zoom level for USA overview
const USA_DEFAULT_ZOOM = 4; // Default zoom level for USA overview

// Default US bounds for the US overview
const USA_BOUNDS: [[number, number], [number, number]] = [
  [24.396308, -125.0], // Southwest corner of US
  [49.384358, -66.93457], // Northeast corner of US
];

// Calculate region bounds based on sublocation coordinates
const calculateRegionBounds = (region: Region): L.LatLngBounds => {
  // Start with the center coordinates
  const bounds = L.latLngBounds(
    L.latLng(region.centerCoordinates[0], region.centerCoordinates[1]),
    L.latLng(region.centerCoordinates[0], region.centerCoordinates[1]),
  );

  // Extend the bounds to include all sublocations
  region.sublocations.forEach((location) => {
    bounds.extend(L.latLng(location.coordinates[0], location.coordinates[1]));
  });

  // Calculate the size of the current bounds
  const latSpread = bounds.getNorth() - bounds.getSouth();
  const lngSpread = bounds.getEast() - bounds.getWest();

  // Use more generous padding for panning freedom (20-50%)
  // Smaller regions get more padding, larger regions less
  const areaSizeKm = latSpread * lngSpread * 111 * 111; // rough conversion to km²
  const padRatio = Math.max(
    0.2,
    Math.min(0.5, 0.5 - (areaSizeKm / 200000) * 0.3),
  );

  // Add generous padding to allow free panning within region
  const latPadding = latSpread * padRatio;
  const lngPadding = lngSpread * padRatio;

  return L.latLngBounds(
    L.latLng(bounds.getSouth() - latPadding, bounds.getWest() - lngPadding),
    L.latLng(bounds.getNorth() + latPadding, bounds.getEast() + lngPadding),
  );
};

// Helper function to calculate optimal view parameters for a region
const calculateOptimalView = (
  region: Region,
): {
  center: [number, number];
  zoom: number;
  minZoom: number;
  bounds: L.LatLngBounds;
  visualBounds: L.LatLngBounds; // Add a separate bounds for visual indicators
} => {
  // Calculate bounds based on all sublocations
  const bounds = calculateRegionBounds(region);

  // Create a tighter visual bounds for indicators
  const latSpread = bounds.getNorth() - bounds.getSouth();
  const lngSpread = bounds.getEast() - bounds.getWest();

  // Use minimal padding for visual bounds (5-15%)
  const visualPadRatio = Math.max(
    0.05,
    Math.min(0.15, 0.15 - ((latSpread * lngSpread * 111 * 111) / 100000) * 0.1),
  );

  // Visual bounds for indicators
  const visualBounds = L.latLngBounds(
    L.latLng(
      bounds.getSouth() - latSpread * visualPadRatio,
      bounds.getWest() - lngSpread * visualPadRatio,
    ),
    L.latLng(
      bounds.getNorth() + latSpread * visualPadRatio,
      bounds.getEast() + lngSpread * visualPadRatio,
    ),
  );

  // Use center of the bounds as the optimal center
  const center: [number, number] = [
    bounds.getCenter().lat,
    bounds.getCenter().lng,
  ];

  // Use more realistic screen dimensions for calculations (common 16:9 aspect ratio)
  const mockMapDiv = document.createElement('div');
  mockMapDiv.style.width = '1000px'; // More realistic width
  mockMapDiv.style.height = '600px'; // 16:9 aspect ratio
  const mockMap = L.map(mockMapDiv, { doubleClickZoom: false });

  // Fit the map to the calculated bounds
  mockMap.fitBounds(bounds);

  // Get the calculated ideal zoom level that fits all locations
  const calculatedZoom = mockMap.getZoom();

  // For minimum zoom, we'll only allow zooming out slightly from the initial view
  // This ensures users can't zoom out too far from the region view
  const minZoom = Math.max(calculatedZoom - 1, 9); // Allow 1 zoom level out, but never below 9

  // Clean up the mock map
  mockMap.remove();

  // Initial zoom should be the calculated level that fits all locations
  // If region specifies a defaultZoom, use that only if it's more zoomed in
  const zoom = region.defaultZoom
    ? Math.max(calculatedZoom, region.defaultZoom)
    : calculatedZoom;

  return { center, zoom, minZoom, bounds, visualBounds };
};

// Pre-calculate and enhance region data with optimal view parameters
const enhanceRegionData = (
  region: Region,
): Region & {
  optimalView: {
    center: [number, number];
    zoom: number;
    minZoom: number;
    bounds: L.LatLngBounds;
    visualBounds: L.LatLngBounds;
  };
} => {
  const optimalView = calculateOptimalView(region);

  return {
    ...region,
    optimalView,
  };
};

// Component for location popup content
const PopupContent = styled.div`
  min-width: 250px;
  padding: 0;
  font-family: 'HK Grotesk', Arial, sans-serif;
  color: #f8f9fa;
`;

const PopupTitle = styled.h3<{ color?: string }>`
  margin: 0 0 12px 0;
  font-size: 18px;
  color: ${(props) => props.color || COLORS.gogo_blue};
  border-bottom: 1px solid rgba(107, 114, 253, 0.3);
  padding-bottom: 8px;
  font-weight: 600;
  letter-spacing: 0.02em;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 40%;
    height: 2px;
    background: linear-gradient(
      90deg,
      ${(props) => props.color || COLORS.gogo_blue},
      rgba(107, 114, 253, 0)
    );
  }
`;

const PopupType = styled.div<{ color?: string }>`
  font-size: 12px;
  color: #f8f9fa;
  margin-bottom: 10px;
  text-transform: capitalize;
  background: linear-gradient(
    90deg,
    ${(props) =>
      props.color ? `${props.color}40` : `${COLORS.gogo_purple}40`},
    ${(props) => (props.color ? `${props.color}20` : `${COLORS.gogo_blue}20`)}
  );
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-weight: 500;
  letter-spacing: 0.03em;
  border: 1px solid rgba(107, 114, 253, 0.2);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ProgramsList = styled.ul`
  margin: 8px 0;
  padding-left: 20px;
  font-size: 14px;
  line-height: 1.5;

  li {
    margin-bottom: 4px;
    position: relative;

    &::marker {
      color: ${COLORS.gogo_yellow};
    }
  }
`;

const ProgramsTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  margin-top: 14px;
  margin-bottom: 6px;
  color: ${COLORS.gogo_yellow};
  display: flex;
  align-items: center;

  &::before {
    content: '★';
    margin-right: 6px;
    font-size: 12px;
  }
`;

const SupportedBy = styled.div`
  font-style: italic;
  font-size: 13px;
  margin-top: 16px;
  color: ${COLORS.gogo_yellow};
  background: linear-gradient(
    90deg,
    rgba(30, 30, 36, 0.4),
    rgba(40, 40, 48, 0.4)
  );
  padding: 8px 12px;
  border-radius: 6px;
  border-left: 2px solid ${COLORS.gogo_yellow};
`;

const ViewRegionButton = styled.button<{ color?: string }>`
  margin-top: 14px;
  padding: 8px 16px;
  background: linear-gradient(
    90deg,
    ${(props) => props.color || COLORS.gogo_blue},
    ${COLORS.gogo_purple}
  );
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  width: 100%;
  transition: all 0.25s ease;
  font-size: 14px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  letter-spacing: 0.03em;
  position: relative;
  overflow: hidden;

  &:hover {
    box-shadow: 0 4px 12px rgba(107, 114, 253, 0.4);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(107, 114, 253, 0.3);
  }

  &::after {
    content: '';
    position: absolute;
    width: 30px;
    height: 100%;
    top: 0;
    left: -40px;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.3) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: skewX(-25deg);
    transition: all 0.75s ease;
  }

  &:hover::after {
    left: 110%;
  }
`;

const WebsiteLink = styled.a<{ color?: string }>`
  display: inline-block;
  margin-top: 12px;
  color: ${(props) => props.color || COLORS.gogo_blue};
  font-size: 13px;
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid rgba(107, 114, 253, 0.3);
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(107, 114, 253, 0.1);
    border-color: rgba(107, 114, 253, 0.5);
    text-decoration: none;
    transform: translateY(-1px);
  }

  &::after {
    content: ' →';
    opacity: 0;
    transition: all 0.2s ease;
  }

  &:hover::after {
    opacity: 1;
    margin-left: 4px;
  }
`;

const PopupDescription = styled.div`
  font-size: 14px;
  line-height: 1.5;
  margin: 12px 0;
  color: rgba(255, 255, 255, 0.9);
  padding-left: 2px;
`;

// Custom tooltip style
const RegionTooltip = styled(Tooltip)`
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid ${COLORS.gogo_blue};
  color: white;
  font-size: 14px;
  font-weight: bold;
`;

// Custom map controls
const MapControls = styled.div<{ isVisible: boolean }>`
  position: absolute;
  bottom: 12px;
  right: 12px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 8px;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transform: ${(props) =>
    props.isVisible ? 'translateY(0)' : 'translateY(10px)'};
  transition: opacity 0.3s ease, transform 0.3s ease;
  pointer-events: ${(props) => (props.isVisible ? 'auto' : 'none')};
`;

const ControlButton = styled.button<{ color?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: rgba(20, 20, 28, 0.85);
  border: 1px solid rgba(107, 114, 253, 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  cursor: pointer;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);

  &:hover {
    background: rgba(30, 30, 40, 0.9);
    border: 1px solid ${(props) => props.color || COLORS.gogo_blue};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 20px;
    height: 20px;
    fill: currentColor;
  }
`;

// Custom USA icon for the return to USA button
function USAIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
    >
      <path
        fill="currentColor"
        d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20c-4.41,0-8-3.59-8-8s3.59-8,8-8s8,3.59,8,8 S16.41,20,12,20z M9.91,8.5L8.5,9.91L10.59,12L8.5,14.09l1.41,1.41L12,13.41l2.09,2.09l1.41-1.41L13.41,12l2.09-2.09L14.09,8.5 L12,10.59L9.91,8.5z"
      />
    </svg>
  );
}

// The component to render custom controls on the map
interface MapCustomControlsProps {
  onExitRegion: () => void;
  isRegionSelected: boolean;
}

function MapCustomControls({
  onExitRegion,
  isRegionSelected,
}: MapCustomControlsProps) {
  return (
    <MapControls isVisible={isRegionSelected}>
      <ControlButton onClick={onExitRegion} title="Return to USA map">
        <USAIcon />
      </ControlButton>
    </MapControls>
  );
}

// Add a new component for a boundary indicator
const BoundaryIndicator = styled.div<{
  visible: boolean;
  direction: 'top' | 'right' | 'bottom' | 'left';
}>`
  position: absolute;
  z-index: 1000;
  pointer-events: none;
  opacity: ${(props) => (props.visible ? 0.7 : 0)};
  transition: opacity 0.3s ease;

  ${(props) => {
    switch (props.direction) {
      case 'top':
        return `
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(to bottom, ${COLORS.gogo_yellow}99, transparent);
        `;
      case 'right':
        return `
          top: 0;
          bottom: 0;
          right: 0;
          width: 4px;
          background: linear-gradient(to left, ${COLORS.gogo_yellow}99, transparent);
        `;
      case 'bottom':
        return `
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(to top, ${COLORS.gogo_yellow}99, transparent);
        `;
      case 'left':
        return `
          top: 0;
          bottom: 0;
          left: 0;
          width: 4px;
          background: linear-gradient(to right, ${COLORS.gogo_yellow}99, transparent);
        `;
      default:
        return '';
    }
  }}
`;

// Add a boundary message component
const BoundaryMessage = styled.div<{ visible: boolean }>`
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(20, 20, 28, 0.85);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  z-index: 900;
  pointer-events: none;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transition: opacity 0.3s ease, transform 0.3s ease;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  border: 1px solid ${COLORS.gogo_yellow}80;
  text-align: center;
  transform: ${(props) =>
    props.visible
      ? 'translateX(-50%) translateY(0)'
      : 'translateX(-50%) translateY(10px)'};
  max-width: 80%;

  strong {
    color: ${COLORS.gogo_yellow};
    font-weight: 600;
  }
`;

// Add a map instruction tooltip
const MapInstruction = styled.div<{ visible: boolean }>`
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%)
    translateY(${(props) => (props.visible ? '0' : '-20px')});
  background: rgba(20, 20, 28, 0.85);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  z-index: 900;
  pointer-events: none;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transition: opacity 0.5s ease, transform 0.3s ease;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(107, 114, 253, 0.3);

  span {
    color: ${COLORS.gogo_yellow};
    font-weight: 500;
  }
`;

// Stats components for displaying region statistics
const StatsBar = styled.div<{ isVisible: boolean }>`
  display: flex;
  gap: 20px;
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 8px 12px;
  background: rgba(20, 20, 28, 0.85);
  border-radius: 8px;
  z-index: 900;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transform: ${(props) =>
    props.isVisible ? 'translateY(0)' : 'translateY(-10px)'};
  transition: opacity 0.3s ease, transform 0.3s ease;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(107, 114, 253, 0.3);
  pointer-events: none;
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatValue = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: ${COLORS.gogo_yellow};
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: ${COLORS.white};
  opacity: 0.8;
`;

// Create a component to handle stats
interface MapStatsProps {
  regions: Region[];
  selectedRegion?: Region;
}

function MapStats({ regions, selectedRegion }: MapStatsProps) {
  // Count total locations and programs for the selected region or all regions
  const statsData = useMemo(() => {
    if (selectedRegion) {
      // Stats for selected region
      const cityCount = 1;
      const locationCount = selectedRegion.sublocations.length;
      const programCount = selectedRegion.sublocations.reduce(
        (count, location) => count + (location.programs?.length || 0),
        0,
      );

      return { cityCount, locationCount, programCount };
    }

    // Stats for all regions
    const cityRegions = regions.filter(
      (region) => region.id !== 'summer-programs',
    );
    const cityCount = cityRegions.length;
    const locationCount = regions.reduce(
      (count, region) => count + region.sublocations.length,
      0,
    );
    const totalProgramCount = regions.reduce((count, region) => {
      const regionProgramCount = region.sublocations.reduce(
        (subCount, location) => subCount + (location.programs?.length || 0),
        0,
      );
      return count + regionProgramCount;
    }, 0);

    return { cityCount, locationCount, programCount: totalProgramCount };
  }, [regions, selectedRegion]);

  return (
    <StatsBar isVisible>
      <Stat>
        <StatValue>{statsData.cityCount}</StatValue>
        <StatLabel>{selectedRegion ? 'City' : 'Cities'}</StatLabel>
      </Stat>
      <Stat>
        <StatValue>{statsData.locationCount}</StatValue>
        <StatLabel>Locations</StatLabel>
      </Stat>
      <Stat>
        <StatValue>{statsData.programCount}</StatValue>
        <StatLabel>Programs</StatLabel>
      </Stat>
    </StatsBar>
  );
}

// Navigation instructions components
const NavigationInstructions = styled.div<{
  isVisible: boolean;
  isRegionView: boolean;
  regionColor?: string;
}>`
  position: absolute;
  ${(props) =>
    props.isRegionView
      ? `
      bottom: 15px;
      left: 15px;
      top: auto;
      transform: translateY(${props.isVisible ? '0' : '20px'});
    `
      : `
      top: 15px;
      left: 50%;
      transform: translateX(-50%) translateY(${
        props.isVisible ? '0' : '-20px'
      });
      text-align: center;
    `}
  background: rgba(20, 20, 28, 0.85);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  color: white;
  z-index: 900;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transition: opacity 0.3s ease, transform 0.3s ease;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  border: 1px solid
    ${(props) => {
      if (props.isRegionView)
        return props.regionColor
          ? `${props.regionColor}80`
          : `${COLORS.gogo_yellow}80`;
      return `${COLORS.gogo_blue}80`;
    }};
  display: flex;
  align-items: center;
  max-width: 80%;
  text-align: ${(props) => (props.isRegionView ? 'left' : 'center')};
  pointer-events: none;
`;

const InfoIcon = styled.span<{ isRegionView: boolean }>`
  display: inline-block;
  width: 16px;
  height: 16px;
  background-color: ${COLORS.gogo_blue};
  color: white;
  border-radius: 50%;
  text-align: center;
  line-height: 16px;
  font-weight: bold;
  margin-right: 8px;
  font-size: 10px;
`;

// Component to handle navigation instructions
interface MapNavigationInstructionsProps {
  selectedRegion?: Region;
}

function MapNavigationInstructions({
  selectedRegion,
}: MapNavigationInstructionsProps) {
  const isRegionView = !!selectedRegion;

  return (
    <NavigationInstructions isVisible isRegionView={isRegionView}>
      <InfoIcon isRegionView={isRegionView}>
        {isRegionView ? '🔍' : 'i'}
      </InfoIcon>
      <div>
        {isRegionView
          ? `Explore ${selectedRegion.name}. Zoom out fully to return to the national map. Click on markers to see location details.`
          : 'Click on any region marker to explore GOGO&apos;s locations in that area.'}
      </div>
    </NavigationInstructions>
  );
}

// Create a component to handle boundary indicators
interface BoundaryIndicatorsProps {
  map: L.Map;
  bounds?: L.LatLngBounds;
  isRegionSelected: boolean;
}

function BoundaryIndicators({
  map,
  bounds,
  isRegionSelected,
}: BoundaryIndicatorsProps) {
  const [indicators, setIndicators] = useState({
    top: false,
    right: false,
    bottom: false,
    left: false,
  });
  const [showMessage, setShowMessage] = useState(false);
  const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Function to clear message timeout
  const clearMessageTimeout = () => {
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
      messageTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      clearMessageTimeout();
    };
  }, []);

  useEffect(() => {
    if (!bounds || !isRegionSelected) {
      setIndicators({ top: false, right: false, bottom: false, left: false });
      setShowMessage(false);
      return undefined; // Explicitly return undefined for consistent-return rule
    }

    const updateIndicators = () => {
      if (!map || !bounds) return;

      const mapCenter = map.getCenter();
      const south = bounds.getSouth();
      const north = bounds.getNorth();
      const west = bounds.getWest();
      const east = bounds.getEast();

      // Define a threshold distance from the bounds to show the indicators
      // This is a percentage of the total bounds size
      const threshold = {
        lat: (north - south) * 0.15, // 15% of the latitude range
        lng: (east - west) * 0.15, // 15% of the longitude range
      };

      // Check if we're near any boundary
      const nearBoundary = {
        top: mapCenter.lat > north - threshold.lat, // Near north boundary
        right: mapCenter.lng > east - threshold.lng, // Near east boundary
        bottom: mapCenter.lat < south + threshold.lat, // Near south boundary
        left: mapCenter.lng < west + threshold.lng, // Near west boundary
      };

      // Show indicators when approaching boundaries
      setIndicators(nearBoundary);

      // Determine if we should show the boundary message
      const atBoundary =
        mapCenter.lat >= north - threshold.lat / 3 ||
        mapCenter.lng >= east - threshold.lng / 3 ||
        mapCenter.lat <= south + threshold.lat / 3 ||
        mapCenter.lng <= west + threshold.lng / 3;

      if (atBoundary) {
        // Show message when user is very close to boundary
        setShowMessage(true);

        // Clear any existing timeout
        clearMessageTimeout();

        // Set a timeout to hide the message after 2.5 seconds
        messageTimeoutRef.current = setTimeout(() => {
          setShowMessage(false);
        }, 2500);
      }
    };

    map.on('move', updateIndicators);
    map.on('dragend', updateIndicators);

    // Initial update
    updateIndicators();

    return () => {
      map.off('move', updateIndicators);
      map.off('dragend', updateIndicators);
      clearMessageTimeout();
    };
  }, [map, bounds, isRegionSelected]);

  return (
    <>
      <BoundaryIndicator visible={indicators.top} direction="top" />
      <BoundaryIndicator visible={indicators.right} direction="right" />
      <BoundaryIndicator visible={indicators.bottom} direction="bottom" />
      <BoundaryIndicator visible={indicators.left} direction="left" />
      <BoundaryMessage visible={showMessage}>
        You&apos;ve reached the <strong>edge of this region</strong>. Zoom out
        to see other regions.
      </BoundaryMessage>
    </>
  );
}

// Also add this new MapEvents component to handle map events and boundary indicators
function MapEvents({ region }: { region: Region & { optimalView?: any } }) {
  const map = useMap();

  // Get bounds safely even if optimalView is undefined
  const bounds =
    region.optimalView?.visualBounds ||
    region.optimalView?.bounds ||
    calculateRegionBounds(region);

  return <BoundaryIndicators map={map} bounds={bounds} isRegionSelected />;
}

interface MapProps {
  regions?: Region[];
  activeRegion?: Region;
  center?: [number, number];
  zoom?: number;
  className?: string;
  onRegionSelect?: (region: Region) => void;
  onLocationSelect?: (location: Sublocation) => void;
  fitToMarkers?: boolean;
  showStats?: boolean;
  showInstructions?: boolean;
}

function Map({
  regions = [],
  activeRegion,
  center = [41.8781, -87.6298], // Default to Chicago
  zoom = 10,
  className,
  onRegionSelect,
  onLocationSelect,
  fitToMarkers = true, // Default to fitting view to markers
  showStats = true, // Show stats by default
  showInstructions = true, // Show instructions by default
}: MapProps) {
  // Enhance regions with pre-calculated optimal view settings
  const enhancedRegions = useMemo(() => {
    return regions.map((region) => enhanceRegionData(region));
  }, [regions]);

  // Find the active region from the enhanced regions
  const enhancedActiveRegion = useMemo(() => {
    if (!activeRegion) return undefined;
    return enhancedRegions.find((r) => r.id === activeRegion.id);
  }, [activeRegion, enhancedRegions]);

  // Determine which region and locations to display
  const [selectedRegion, setSelectedRegion] = useState<
    | (Region & {
        optimalView?: {
          center: [number, number];
          zoom: number;
          minZoom: number;
          bounds: L.LatLngBounds;
          visualBounds: L.LatLngBounds;
        };
      })
    | undefined
  >(enhancedActiveRegion);

  // Keep track of the last selected region's coordinates for centering the USA map when zooming out
  const [lastRegionCoordinates, setLastRegionCoordinates] = useState<
    [number, number] | undefined
  >(undefined);

  // Force re-render on region change by tracking previous region
  const [previousRegionId, setPreviousRegionId] = useState<string | undefined>(
    enhancedActiveRegion?.id,
  );

  // Update selected region when activeRegion prop changes
  useEffect(() => {
    // Only update if the region has actually changed
    if (enhancedActiveRegion?.id !== previousRegionId) {
      console.log(
        `Region changed from ${previousRegionId} to ${enhancedActiveRegion?.id}`,
      );
      setSelectedRegion(enhancedActiveRegion);
      setPreviousRegionId(enhancedActiveRegion?.id);
    }
  }, [enhancedActiveRegion, previousRegionId]);

  const handleRegionSelect = (
    region: Region & {
      optimalView?: {
        center: [number, number];
        zoom: number;
        minZoom: number;
        bounds: L.LatLngBounds;
        visualBounds: L.LatLngBounds;
      };
    },
  ) => {
    // Only update if selecting a different region
    if (region.id !== selectedRegion?.id) {
      console.log(`Selected new region: ${region.name}`);
      setSelectedRegion(region);
      setPreviousRegionId(region.id);

      if (onRegionSelect) {
        onRegionSelect(region);
      }
    }
  };

  const handleLocationSelect = (location: Sublocation) => {
    if (onLocationSelect) {
      onLocationSelect(location);
    }
  };

  // Handle exiting a region to return to USA overview
  const handleExitRegion = () => {
    // Store the coordinates of the region we're exiting to center the USA map there
    if (selectedRegion) {
      setLastRegionCoordinates(selectedRegion.centerCoordinates);
    }

    setSelectedRegion(undefined);
    setPreviousRegionId(undefined);

    if (onRegionSelect) {
      onRegionSelect(undefined as any);
    }
  };

  // Calculate view parameters based on selected region
  const { mapCenter, mapZoom } = useMemo(() => {
    if (selectedRegion) {
      // Use the pre-calculated optimal view if available
      if (selectedRegion.optimalView) {
        return {
          mapCenter: selectedRegion.optimalView.center,
          mapZoom: selectedRegion.optimalView.zoom,
        };
      }

      // Fallback to region's defaults if optimal view not available
      return {
        mapCenter: selectedRegion.centerCoordinates,
        mapZoom: selectedRegion.defaultZoom,
      };
    }

    // Use USA overview parameters centered on the last viewed region if available
    return {
      mapCenter: lastRegionCoordinates || USA_MAP_CENTER,
      mapZoom: USA_DEFAULT_ZOOM,
    };
  }, [selectedRegion, lastRegionCoordinates]);

  // Filter out the summer-programs nationwide region
  const filteredRegions = useMemo(() => {
    return enhancedRegions.filter((region) => region.id !== 'summer-programs');
  }, [enhancedRegions]);

  return (
    <StyledMapContainer
      key={`map-${selectedRegion?.id || 'overview'}-${mapCenter[0]}-${
        mapCenter[1]
      }`}
      center={mapCenter}
      zoom={mapZoom}
      className={className}
      zoomControl={false}
      scrollWheelZoom
      dragging
      isRegionSelected={!!selectedRegion}
      regionColor={selectedRegion?.color}
    >
      <TileLayer
        url={purpleMapStyle.url}
        attribution={purpleMapStyle.attribution}
        maxZoom={purpleMapStyle.maxZoom}
        keepBuffer={4}
        updateWhenIdle
        updateWhenZooming={false}
      />

      {/* Add region markers if no specific region is selected */}
      {!selectedRegion &&
        filteredRegions.map((region) => (
          <Marker
            key={region.id}
            position={region.centerCoordinates}
            icon={createRegionIcon(
              region.color || COLORS.gogo_blue,
              region.name,
            )}
            eventHandlers={{
              click: () => handleRegionSelect(region),
            }}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={0.9} permanent>
              {region.name}
            </Tooltip>
            <Popup>
              <PopupContent>
                <PopupTitle>{region.name}</PopupTitle>
                <div style={{ fontSize: '14px', marginBottom: '10px' }}>
                  {region.sublocations.length} locations
                </div>
                {region.description && (
                  <PopupDescription>{region.description}</PopupDescription>
                )}
                <ViewRegionButton
                  color={region.color}
                  onClick={() => handleRegionSelect(region)}
                >
                  Explore {region.name}
                </ViewRegionButton>
              </PopupContent>
            </Popup>
          </Marker>
        ))}

      {/* Add sublocation markers if a region is selected */}
      {selectedRegion &&
        selectedRegion.sublocations.map((location) => (
          <Marker
            key={location.id}
            position={location.coordinates}
            icon={createMarkerIcon(
              location.type || 'default',
              selectedRegion.color,
            )}
            eventHandlers={{
              click: () => handleLocationSelect(location),
            }}
          >
            <Popup>
              <PopupContent>
                <PopupTitle>{location.name}</PopupTitle>
                {location.type && (
                  <PopupType>{location.type.replace('-', ' ')}</PopupType>
                )}

                {location.description && (
                  <PopupDescription>{location.description}</PopupDescription>
                )}

                {location.programs && location.programs.length > 0 && (
                  <>
                    <ProgramsTitle>Programs</ProgramsTitle>
                    <ProgramsList>
                      {location.programs.map((program, index) => (
                        <li
                          key={`${location.id}-program-${
                            program.replace(/\s+/g, '-').toLowerCase() || index
                          }`}
                        >
                          {program}
                        </li>
                      ))}
                    </ProgramsList>
                  </>
                )}

                {location.supportedBy && location.supportedBy.length > 0 && (
                  <SupportedBy>
                    Supported by: {location.supportedBy.join(', ')}
                  </SupportedBy>
                )}

                {location.website && (
                  <WebsiteLink
                    href={location.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    color={selectedRegion.color}
                  >
                    Visit Website
                  </WebsiteLink>
                )}
              </PopupContent>
            </Popup>
          </Marker>
        ))}

      {/* Map controller for view management */}
      <MapController
        center={mapCenter}
        zoom={mapZoom}
        region={selectedRegion}
        onExitRegion={handleExitRegion}
        lastRegionCoordinates={lastRegionCoordinates}
        fitToMarkers={fitToMarkers}
      />

      {/* Custom map controls */}
      <MapCustomControls
        onExitRegion={handleExitRegion}
        isRegionSelected={selectedRegion !== undefined}
      />

      {/* Boundary indicators */}
      {selectedRegion && <MapEvents region={selectedRegion} />}

      {/* Instruction tooltip - show only in region view */}
      <MapInstruction visible={selectedRegion !== undefined}>
        Click and <span>drag</span> to pan around the map • Use{' '}
        <span>scroll wheel</span> to zoom
      </MapInstruction>

      {/* Stats components - always show */}
      {showStats && (
        <MapStats regions={regions} selectedRegion={selectedRegion} />
      )}

      {/* Navigation instructions - show different content based on context */}
      {showInstructions && (
        <MapNavigationInstructions selectedRegion={selectedRegion} />
      )}
    </StyledMapContainer>
  );
}

export default Map;
