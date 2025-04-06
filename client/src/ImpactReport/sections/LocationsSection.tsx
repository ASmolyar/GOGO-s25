import React from 'react';
import styled from 'styled-components';
import EnhancedLeafletMap from '../../components/map/EnhancedLeafletMap';
import COLORS from '../../assets/colors.ts';

// Create a SectionContainer component since we can't import it
const SectionContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  width: 100%;
`;

const LocationsSectionWrapper = styled.div`
  margin-bottom: 6rem;
`;

const SectionHeading = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  text-align: center;
  color: ${COLORS.gogo_blue};
`;

const SectionSubheading = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 3rem;
  text-align: center;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const MapContainer = styled.div`
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1.5rem;
  background: ${COLORS.black};
`;

const CaptionText = styled.p`
  font-size: 0.9rem;
  color: ${COLORS.gray};
  text-align: center;
  font-style: italic;
  margin-top: 1rem;
`;

const LocationsSection: React.FC = () => {
  return (
    <LocationsSectionWrapper id="locations">
      <SectionContainer>
        <SectionHeading>Our National Impact</SectionHeading>
        <SectionSubheading>
          GOGO is making a difference across the United States. Explore our map to see where we're active
          and the communities we're serving through our various programs and partnerships.
        </SectionSubheading>
        
        <MapContainer>
          <EnhancedLeafletMap />
        </MapContainer>
        
        <CaptionText>
          Click on regions or locations to explore details about our programs and impact.
        </CaptionText>
      </SectionContainer>
    </LocationsSectionWrapper>
  );
};

export default LocationsSection; 