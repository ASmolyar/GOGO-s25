import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styled from 'styled-components';
import Map from './Map';
import regions from './data/regions';
import COLORS from '../../../assets/colors.ts';

// Modified for better integration with Impact Report
const MapDemoContainer = styled.div`
  padding: 0;
  max-width: 100%;
  margin: 0;
  background-color: transparent;
  color: white;
`;

// Define a container for the map that preserves the aspect ratio
const MapContainer = styled.div`
  width: 100%;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  margin-bottom: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 450px; /* Add fixed height for the map container */
`;

// Simplified version that doesn't use React.lazy for direct embedding
function DirectMapDemo() {
  return (
    <MapDemoContainer>
      <MapContainer>
        <Map
          regions={regions}
          center={[39.8283, -98.5795]} // Center of US
          zoom={4} // Show all US
          showStats
          showInstructions
        />
      </MapContainer>
    </MapDemoContainer>
  );
}

export default DirectMapDemo;
