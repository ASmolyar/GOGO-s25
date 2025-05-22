import React, { useState } from 'react';
import styled from 'styled-components';
import Map from './Map';
import COLORS from '../../../assets/colors.ts';
import { Region } from './types';
import regions from './data/regions';

// Modified for better integration with Impact Report
const MapDemoContainer = styled.div`
  padding: 0;
  max-width: 100%;
  margin: 0;
  background-color: transparent;
  color: white;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
  color: white;
  border-bottom: 2px solid var(--spotify-green, #1db954);
  padding-bottom: 10px;
  font-weight: 700;
  font-family: var(
    --font-main,
    'Gotham',
    'Montserrat',
    'Helvetica Neue',
    sans-serif
  );
  display: none; /* Hide title as Impact Report has its own */
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

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6);
  }
`;

// Component to showcase GOGO's locations across major US cities
function MapDemo() {
  const [activeRegion, setActiveRegion] = useState<Region | undefined>(
    undefined,
  );

  // Handle selecting a region
  const handleRegionSelect = (region: Region) => {
    setActiveRegion(region === activeRegion ? undefined : region);
  };

  return (
    <MapDemoContainer>
      <Title>GOGO National Music Programs</Title>

      <MapContainer>
        <Map
          regions={regions}
          activeRegion={activeRegion}
          center={activeRegion ? undefined : [39.8283, -98.5795]} // Center of US if no region selected
          zoom={activeRegion ? undefined : 4} // Zoom out to show all US if no region selected
          onRegionSelect={handleRegionSelect}
          showStats
          showInstructions
        />
      </MapContainer>
    </MapDemoContainer>
  );
}

export default MapDemo;
