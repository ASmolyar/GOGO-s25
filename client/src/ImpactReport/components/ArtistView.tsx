import React from 'react';
import styled from 'styled-components';
import COLORS from '../../assets/colors.ts';

// Types
interface Track {
  id: string;
  title: string;
  plays: string;
  duration: string;
}

interface Artist {
  id: string;
  name: string;
  image: string;
  monthlyListeners: string;
  description: string;
  popularTracks: Track[];
}

interface ArtistProps {
  artist: Artist;
}

// Styled components
const ArtistContainer = styled.div`
  padding: 24px 32px;
`;

const ArtistHeader = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 24px;
  position: relative;
`;

const ArtistBackground = styled.div<{ image: string }>`
  position: absolute;
  top: -400px;
  left: -32px;
  right: -32px;
  height: 500px;
  background-image: url(${(props) => props.image});
  background-size: cover;
  background-position: center 30%;
  filter: blur(10px) brightness(0.3);
  z-index: 0;
`;

const ArtistGradient = styled.div`
  position: absolute;
  top: -400px;
  left: -32px;
  right: -32px;
  height: 500px;
  background: linear-gradient(
    transparent 0%,
    rgba(18, 18, 18, 0.7) 60%,
    #121212 100%
  );
  z-index: 1;
`;

const ArtistContent = styled.div`
  display: flex;
  align-items: flex-end;
  position: relative;
  z-index: 2;
  margin-top: 140px;
`;

const ArtistImage = styled.div<{ image: string }>`
  width: 232px;
  height: 232px;
  border-radius: 50%;
  background-image: url(${(props) => props.image});
  background-size: cover;
  background-position: center;
  margin-right: 24px;
  box-shadow: 0 4px 60px rgba(0, 0, 0, 0.5);
`;

const ArtistInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const VerifiedBadge = styled.div`
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  color: white;
  font-weight: 500;
  margin-bottom: 8px;

  & svg {
    margin-right: 8px;
  }
`;

const ArtistName = styled.h1`
  font-size: 96px;
  font-weight: 900;
  color: white;
  margin: 0 0 24px 0;
  letter-spacing: -0.02em;
  line-height: 1;
`;

const ArtistStats = styled.div`
  display: flex;
  align-items: center;
  color: #b3b3b3;
  font-size: 14px;
  margin-bottom: 24px;
`;

const Stat = styled.div`
  margin-right: 24px;
`;

const ArtistControls = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 8px;
`;

const PlayButton = styled.button`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #1db954;
  border: none;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 24px;

  &:hover {
    transform: scale(1.05);
    background-color: #1ed760;
  }
`;

const FollowButton = styled.button`
  padding: 8px 32px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background-color: transparent;
  color: white;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;

  &:hover {
    border-color: white;
    transform: scale(1.02);
  }
`;

const MoreButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: transparent;
  border: none;
  color: #b3b3b3;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    color: white;
  }
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin: 32px 0 16px 0;
`;

const TracksTable = styled.div`
  width: 100%;
  margin-top: 16px;
`;

const TrackHeader = styled.div`
  display: grid;
  grid-template-columns: 40px 4fr 2fr 1fr;
  padding: 0 16px 8px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const HeaderCell = styled.div`
  font-size: 12px;
  color: #b3b3b3;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const TrackRow = styled.div`
  display: grid;
  grid-template-columns: 40px 4fr 2fr 1fr;
  padding: 8px 16px;
  border-radius: 4px;
  align-items: center;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const TrackNumber = styled.div`
  font-size: 16px;
  color: #b3b3b3;
`;

const TrackTitle = styled.div`
  font-size: 16px;
  color: white;
  font-weight: 500;
`;

const TrackPlays = styled.div`
  font-size: 14px;
  color: #b3b3b3;
`;

const TrackDuration = styled.div`
  font-size: 14px;
  color: #b3b3b3;
  text-align: right;
`;

const AboutSection = styled.div`
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const AboutTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin: 0 0 16px 0;
`;

const AboutText = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: #b3b3b3;
  max-width: 800px;
`;

// SVG icons
const VerifiedIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#3D91F4">
    <path d="M12 1a11 11 0 1 0 0 22 11 11 0 0 0 0-22zm5.045 8.866L11.357 16.9l-4.4-3.396a.75.75 0 1 1 .914-1.182l3.417 2.639 4.968-6.276a.749.749 0 0 1 1.185.918l-.003.004a.752.752 0 0 1-.136.177l-.258.326z" />
  </svg>
);

const MoreIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4.5 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm7.5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm7.5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
  </svg>
);

// Default props for demo
const defaultArtist: Artist = {
  id: 'caetano-veloso',
  name: 'Caetano Veloso',
  image: 'https://i.scdn.co/image/ab6761610000e5eb0130d3f78e4348990cbb987b',
  monthlyListeners: '4,355,363',
  description:
    'A true heavyweight, Caetano Veloso is a pop musician, political activist and intellectual who was also a driving force behind Tropicália, the late-1960s arts movement that influenced literature, film, visual arts and music in Brazil.',
  popularTracks: [
    {
      id: 'cv-1',
      title: 'Chuvos De Verão - Remastered 2006',
      plays: '17,844,557',
      duration: '4:10',
    },
    { id: 'cv-2', title: 'Sozinho', plays: '15,622,418', duration: '3:47' },
    { id: 'cv-3', title: 'Leãozinho', plays: '14,376,809', duration: '2:30' },
    { id: 'cv-4', title: 'Você É Linda', plays: '12,933,254', duration: '3:58' },
    { id: 'cv-5', title: 'Lua e Estrela', plays: '9,876,543', duration: '3:21' },
  ],
};

const ArtistView: React.FC<ArtistProps> = ({ artist = defaultArtist }) => {
  return (
    <ArtistContainer>
      <ArtistHeader>
        <ArtistBackground image={artist.image} />
        <ArtistGradient />
        <ArtistContent>
          <ArtistImage image={artist.image} />
          <ArtistInfo>
            <VerifiedBadge>
              <VerifiedIcon />
              Verified Artist
            </VerifiedBadge>
            <ArtistName>{artist.name}</ArtistName>
            <ArtistStats>
              <Stat>{artist.monthlyListeners} monthly listeners</Stat>
            </ArtistStats>
            <ArtistControls>
              <FollowButton>Follow</FollowButton>
              <MoreButton>
                <MoreIcon />
              </MoreButton>
            </ArtistControls>
          </ArtistInfo>
        </ArtistContent>
      </ArtistHeader>

      <SectionTitle>Popular</SectionTitle>
      <TracksTable>
        <TrackHeader>
          <HeaderCell>#</HeaderCell>
          <HeaderCell>Title</HeaderCell>
          <HeaderCell>Plays</HeaderCell>
          <HeaderCell>Duration</HeaderCell>
        </TrackHeader>

        {artist.popularTracks.map((track, index) => (
          <TrackRow key={index} style={{ cursor: 'pointer' }}>
            <TrackNumber>{index + 1}</TrackNumber>
            <TrackTitle>{track.title}</TrackTitle>
            <TrackPlays>{track.plays}</TrackPlays>
            <TrackDuration>{track.duration}</TrackDuration>
          </TrackRow>
        ))}
      </TracksTable>

      <AboutSection>
        <AboutTitle>About</AboutTitle>
        <AboutText>{artist.description}</AboutText>
      </AboutSection>
    </ArtistContainer>
  );
};

export default ArtistView;
