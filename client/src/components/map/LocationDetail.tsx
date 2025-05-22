import React from 'react';
import styled from 'styled-components';
import { Sublocation } from './types';
import COLORS from '../../assets/colors.ts';

const Container = styled.div`
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
  border-left: 4px solid ${COLORS.gogo_yellow};
`;

const Title = styled.h2`
  font-size: 24px;
  margin: 0 0 15px 0;
  color: ${COLORS.gogo_yellow};
`;

const Section = styled.div`
  margin-bottom: 15px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  margin: 0 0 8px 0;
  color: ${COLORS.gogo_blue};
`;

const ProgramTag = styled.span`
  display: inline-block;
  background-color: ${COLORS.gogo_purple};
  color: white;
  padding: 4px 10px;
  margin: 0 8px 8px 0;
  border-radius: 16px;
  font-size: 13px;
`;

const Address = styled.div`
  font-style: italic;
  margin-bottom: 10px;
  color: ${COLORS.lightGray};
`;

const Description = styled.p`
  line-height: 1.5;
  margin: 10px 0;
`;

const SupportedBy = styled.div`
  font-style: italic;
  color: ${COLORS.gogo_green};
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

interface LocationDetailProps {
  location: Sublocation;
}

function LocationDetail({ location }: LocationDetailProps) {
  return (
    <Container>
      <Title>{location.name}</Title>

      {location.address && <Address>{location.address}</Address>}

      {location.type && (
        <Section>
          <SectionTitle>Type</SectionTitle>
          <div>{location.type.replace('-', ' ')}</div>
        </Section>
      )}

      {location.description && (
        <Section>
          <SectionTitle>About</SectionTitle>
          <Description>{location.description}</Description>
        </Section>
      )}

      {location.programs && location.programs.length > 0 && (
        <Section>
          <SectionTitle>Programs</SectionTitle>
          <div>
            {location.programs.map((program, index) => (
              <ProgramTag key={index}>{program}</ProgramTag>
            ))}
          </div>
        </Section>
      )}

      {location.supportedBy && location.supportedBy.length > 0 && (
        <SupportedBy>
          Supported by: {location.supportedBy.join(', ')}
        </SupportedBy>
      )}
    </Container>
  );
}

export default LocationDetail;
