import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import MusicLibrary from './components/MusicLibrary';
import ArtistView from './components/ArtistView';
import NowPlayingBar from './components/NowPlayingBar';
import COLORS from '../assets/colors.ts';

// Main container component for the music page
const PageContainer = styled.div`
  background: linear-gradient(to bottom, #1e1e1e, #121212);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-bottom: 90px; /* Add space for the NowPlayingBar */
`;

// Header component for the music page
const Header = styled.div`
  background-color: rgba(0, 0, 0, 0.6);
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: ${COLORS.gogo_blue};
  cursor: pointer;
`;

const Navigation = styled.div`
  display: flex;
  gap: 24px;
`;

const NavButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    color: ${COLORS.gogo_blue};
  }
`;

const BackButton = styled(NavButton)`
  color: rgba(255, 255, 255, 0.7);
  &:hover {
    color: white;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
`;

const LeftSidebar = styled.div`
  width: 240px;
  background-color: #000;
  padding: 24px 16px;
`;

const NavItem = styled.div`
  padding: 8px 12px;
  color: #b3b3b3;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 16px;

  &:hover {
    color: white;
  }

  &.active {
    background-color: #282828;
    color: white;
  }
`;

const RightContent = styled.div`
  flex: 1;
  overflow-y: auto;
`;

// Interface for track data
interface Track {
  id: string;
  title: string;
  artist: string;
  cover: string;
  duration: string;
  audioSrc?: string;
}

// Interface for popular track data
interface PopularTrack {
  id: string;
  title: string;
  duration: string;
  plays: string;
}

// Mock data for artists
const artists = {
  'caetano-veloso': {
    id: 'caetano-veloso',
    name: 'Caetano Veloso',
    image: 'https://i.scdn.co/image/ab6761610000e5eb23960da5fab496188f9d5054',
    monthlyListeners: '3,249,685',
    description:
      'Brazilian composer, singer, guitarist, writer, and political activist',
    popularTracks: [
      { id: 'cv-1', title: 'Sozinho', duration: '3:48', plays: '31,562,984' },
      { id: 'cv-2', title: 'Leãozinho', duration: '2:56', plays: '28,977,463' },
      {
        id: 'cv-3',
        title: 'Você É Linda',
        duration: '3:58',
        plays: '24,119,734',
      },
      {
        id: 'cv-4',
        title: 'Qualquer Coisa',
        duration: '3:35',
        plays: '12,578,235',
      },
      { id: 'cv-5', title: 'Terra', duration: '8:05', plays: '10,825,189' },
    ],
  },
  'gogo-students': {
    id: 'gogo-students',
    name: 'GOGO Student Ensemble',
    image: '/music/artists/gogo_students.jpg',
    monthlyListeners: '1,287',
    description: 'Student musicians from Guitars Over Guns mentorship program',
    popularTracks: [
      { id: 'gs-1', title: 'Urban Rhythms', duration: '3:45', plays: '4,253' },
      {
        id: 'gs-2',
        title: 'Finding My Voice',
        duration: '4:12',
        plays: '3,879',
      },
      {
        id: 'gs-3',
        title: 'Community Beats',
        duration: '2:58',
        plays: '3,124',
      },
      {
        id: 'gs-4',
        title: "Tomorrow's Sound",
        duration: '3:22',
        plays: '2,865',
      },
      { id: 'gs-5', title: 'The Journey', duration: '5:17', plays: '2,341' },
    ],
  },
  'gogo-mentors': {
    id: 'gogo-mentors',
    name: 'GOGO Mentor Collective',
    image: '/music/artists/gogo_mentors.jpg',
    monthlyListeners: '5,842',
    description:
      'Professional musicians mentoring youth through Guitars Over Guns',
    popularTracks: [
      { id: 'gm-1', title: 'Guidance', duration: '4:32', plays: '12,456' },
      {
        id: 'gm-2',
        title: 'Passing the Torch',
        duration: '3:48',
        plays: '10,235',
      },
      {
        id: 'gm-3',
        title: 'Musical Foundations',
        duration: '5:21',
        plays: '8,754',
      },
      {
        id: 'gm-4',
        title: 'Collaborative Spirit',
        duration: '3:15',
        plays: '7,239',
      },
      {
        id: 'gm-5',
        title: 'Next Generation',
        duration: '4:05',
        plays: '6,587',
      },
    ],
  },
};

// Arrow Left Icon component
const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M11.03.47a.75.75 0 0 1 0 1.06L4.56 8l6.47 6.47a.75.75 0 1 1-1.06 1.06L2.44 8 9.97.47a.75.75 0 0 1 1.06 0z"></path>
  </svg>
);

// Home Icon component
const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5Z"></path>
    <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6Z"></path>
  </svg>
);

const MusicPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track>({
    id: 'gs-1',
    title: 'Urban Rhythms',
    artist: 'GOGO Student Ensemble',
    cover: '/music/albums/student_performances/cover.jpg',
    duration: '3:45',
  });

  // Check if we're in the artist view
  const isArtistView = location.pathname.includes('/artist/');
  const currentArtist = id ? artists[id as keyof typeof artists] : null;

  // Navigation functions
  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoToHome = () => {
    navigate('/music');
  };

  const handleGoToArtist = (artistId: string) => {
    navigate(`/music/artist/${artistId}`);
  };

  // Playback control functions
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNextTrack = () => {
    // In a real app, this would play the next track
    console.log('Playing next track');
  };

  const handlePreviousTrack = () => {
    // In a real app, this would play the previous track
    console.log('Playing previous track');
  };

  // Function to play a track from any component
  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  // Function to transform PopularTrack to Track
  const convertToTrack = (
    track: PopularTrack,
    artistName: string,
    artistImage: string,
  ): Track => {
    return {
      id: track.id,
      title: track.title,
      artist: artistName,
      cover: artistImage,
      duration: track.duration,
    };
  };

  return (
    <PageContainer>
      <Header>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {isArtistView && (
            <BackButton onClick={handleGoBack}>
              <ArrowLeftIcon />
              Back
            </BackButton>
          )}
          <Logo onClick={handleGoToHome}>Music | Guitars Over Guns</Logo>
        </div>
        <Navigation>
          <NavButton onClick={handleGoToHome}>
            <HomeIcon />
            Home
          </NavButton>
        </Navigation>
      </Header>

      <MainContent>
        <LeftSidebar>
          <NavItem className="active">
            <HomeIcon />
            Home
          </NavItem>
          <NavItem>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M6 13c0 1.105-1.12 2-2.5 2S1 14.105 1 13c0-1.104 1.12-2 2.5-2s2.5.896 2.5 2zm9-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2z" />
              <path fillRule="evenodd" d="M14 11V2h1v9h-1zM6 3v10H5V3h1z" />
              <path d="M5 2.905a1 1 0 0 1 .9-.995l8-.8a1 1 0 0 1 1.1.995V3L5 4V2.905z" />
            </svg>
            Browse
          </NavItem>
        </LeftSidebar>

        <RightContent>
          {isArtistView && currentArtist ? (
            <ArtistView
              artist={currentArtist}
              onPlayTrack={(track) => {
                const trackAsTrack = convertToTrack(
                  track,
                  currentArtist.name,
                  currentArtist.image,
                );
                playTrack(trackAsTrack);
              }}
            />
          ) : (
            <MusicLibrary
              onArtistClick={handleGoToArtist}
              onPlayTrack={playTrack}
            />
          )}
        </RightContent>
      </MainContent>

      <NowPlayingBar
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onNext={handleNextTrack}
        onPrevious={handlePreviousTrack}
      />
    </PageContainer>
  );
};

export default MusicPage;
