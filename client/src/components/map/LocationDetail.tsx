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

const ExtraTextSection = styled.div`
  font-style: italic;
  color: ${COLORS.gogo_green};
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const MediaContainer = styled.div`
  margin: 15px 0;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
`;

const LocationImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
  object-fit: cover;
`;

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
  border-radius: 8px;
`;

const VideoIframe = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 8px;
`;

interface LocationDetailProps {
  location: Sublocation;
}

function LocationDetail({ location }: LocationDetailProps) {
  // Helper function to check if location has media
  const hasMedia = (
    loc: Sublocation,
  ): loc is Sublocation & {
    mediaType: 'image' | 'video';
    mediaUrl: string;
  } => {
    return (
      'mediaType' in loc &&
      !!loc.mediaType &&
      'mediaUrl' in loc &&
      !!loc.mediaUrl
    );
  };

  // Helper function to render media based on type
  const renderMedia = () => {
    if (!hasMedia(location)) return null;

    if (location.mediaType === 'image') {
      return (
        <MediaContainer>
          <LocationImage src={location.mediaUrl} alt={location.name} />
        </MediaContainer>
      );
    } else if (location.mediaType === 'video') {
      return (
        <MediaContainer>
          <VideoContainer>
            <VideoIframe
              src={location.mediaUrl}
              title={`Video of ${location.name}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </VideoContainer>
        </MediaContainer>
      );
    }

    return null;
  };

  return (
    <Container>
      <Title>{location.name}</Title>

      {location.address && <Address>{location.address}</Address>}

      {/* Display media right after the address */}
      {renderMedia()}

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

      {location.mediums && location.mediums.length > 0 && (
        <Section>
          <SectionTitle>Mediums</SectionTitle>
          <div>
            {location.mediums.map((medium, index) => (
              <ProgramTag key={index}>{medium}</ProgramTag>
            ))}
          </div>
        </Section>
      )}

      {location.extraText && (
        <ExtraTextSection>{location.extraText}</ExtraTextSection>
      )}
    </Container>
  );
}

export default LocationDetail;
