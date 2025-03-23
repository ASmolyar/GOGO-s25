import React, { useState } from 'react';
import styled from 'styled-components';
import Map from './Map';
import COLORS from '../../assets/colors.ts';
import { Region } from './types';
import regions from './data/regions';

const MapDemoContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: ${COLORS.darkModePastelBlack};
  color: ${COLORS.white};
`;

const Title = styled.h1`
  font-size: 28px;
  margin-bottom: 20px;
  color: ${COLORS.gogo_blue};
  border-bottom: 2px solid ${COLORS.gogo_yellow};
  padding-bottom: 10px;
`;

// Define a container for the map that preserves the aspect ratio
const MapContainer = styled.div`
  width: 100%;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  margin-bottom: 20px;
`;

// Component to showcase GOGO's locations across major US cities
function MapDemo() {
  const [activeRegion, setActiveRegion] = useState<Region | undefined>(undefined);

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
          showStats={true}
          showInstructions={true}
        />
      </MapContainer>
    </MapDemoContainer>
  );
}

export default MapDemo;
