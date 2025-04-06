import React from 'react';
import styled from 'styled-components';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for Leaflet's default icon issues
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Set default icon for all markers using type assertion to handle TypeScript error
// @ts-ignore - This is a workaround for the Leaflet typings issue
L.Marker.prototype.options.icon = DefaultIcon;

const MapWrapper = styled.div`
  height: 450px;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
`;

// Major US cities where GOGO operates with proper typing
const locations: Array<{
  name: string;
  position: [number, number]; // Explicitly define as tuple for LatLngExpression
  description: string;
}> = [
  {
    name: 'Miami',
    position: [25.7617, -80.1918],
    description: 'GOGO Headquarters',
  },
  {
    name: 'Chicago',
    position: [41.8781, -87.6298],
    description: 'Established 2014',
  },
  {
    name: 'Los Angeles',
    position: [34.0522, -118.2437],
    description: 'Established 2021',
  },
  {
    name: 'New York',
    position: [40.7128, -74.006],
    description: 'Newest location',
  },
];

// Simple map implementation without complex components
function SimpleMapDemo() {
  return (
    <MapWrapper>
      <MapContainer
        center={[39.8283, -98.5795] as [number, number]} // Type assertion for center
        zoom={4}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {locations.map((location, index) => (
          <Marker key={`location-${index}`} position={location.position}>
            <Popup>
              <div>
                <h3>{location.name}</h3>
                <p>{location.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </MapWrapper>
  );
}

export default SimpleMapDemo;
