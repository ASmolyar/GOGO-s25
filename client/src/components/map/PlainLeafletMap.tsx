// @ts-nocheck - Disable TypeScript checking for this file to avoid Leaflet typing issues
import React, { useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styled from 'styled-components';
import COLORS from '../../assets/colors.ts';

// Import Leaflet images directly
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const MapContainer = styled.div`
  height: 450px;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
`;

// GOGO locations
const locations = [
  { name: 'Miami', position: [25.7617, -80.1918], description: 'GOGO Headquarters' },
  { name: 'Chicago', position: [41.8781, -87.6298], description: 'Established 2014' },
  { name: 'Los Angeles', position: [34.0522, -118.2437], description: 'Established 2021' },
  { name: 'New York', position: [40.7128, -74.0060], description: 'Newest location' },
];

// Component that uses Leaflet directly without React Context
function PlainLeafletMap() {
  // Create a ref to store the map DOM element
  const mapRef = useRef(null);
  // Create a ref to store the map instance
  const leafletMapRef = useRef(null);

  useEffect(() => {
    // Prevent multiple initializations
    if (leafletMapRef.current || !mapRef.current) return;

    // Fix default icon issue
    const DefaultIcon = L.icon({
      iconUrl: icon,
      shadowUrl: iconShadow,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });

    // Set default icon for all markers
    L.Marker.prototype.options.icon = DefaultIcon;

    // Initialize map
    const map = L.map(mapRef.current).setView([39.8283, -98.5795], 4);
    leafletMapRef.current = map;

    // Add tile layer
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add markers for each location
    locations.forEach((location) => {
      const marker = L.marker(location.position).addTo(map);
      
      // Create a custom popup with our styling
      const popupContent = document.createElement('div');
      popupContent.style.textAlign = 'center';
      
      const title = document.createElement('h3');
      title.textContent = location.name;
      title.style.margin = '5px 0';
      title.style.color = COLORS.gogo_blue;
      
      const description = document.createElement('div');
      description.textContent = location.description;
      description.style.margin = '5px 0';
      
      popupContent.appendChild(title);
      popupContent.appendChild(description);
      
      marker.bindPopup(popupContent);
    });

    // Clean up function
    return () => {
      // Check if map exists before removing
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  return <MapContainer ref={mapRef} />;
}

export default PlainLeafletMap; 