import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import MusicLibrary from './components/MusicLibrary';
import ArtistView from './components/ArtistView';
import AlbumPage from './components/AlbumPage';
import NowPlayingBar from './components/NowPlayingBar';
import COLORS from '../assets/colors.ts';
import { pageEnterAnimation, nowPlayingEnterAnimation } from '../utils/animations';

// Main container component for the music page
const PageContainer = styled.div`
  background: linear-gradient(to bottom, #1e1e1e, #121212);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-bottom: 90px; /* Add space for the NowPlayingBar */
  opacity: 0; /* Start with opacity 0 for animation */
`;

// Content wrapper for animation purposes
const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
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
  duration: string;
  plays: string;
  artist: string;
  cover: string;
}

interface PlaybackTrack extends Omit<Track, 'plays'> {
  // PlaybackTrack has everything except 'plays'
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
  artist: {
    id: string;
    name: string;
    image: string;
    monthlyListeners: string;
    description: string;
    popularTracks: {
      id: string;
      title: string;
      duration: string;
      plays: string;
    }[];
  };
  onPlayTrack: (track: Track) => void;
}

// Add the required interfaces for components based on their definitions
interface Artist {
  id: string;
  name: string;
  image: string;
  monthlyListeners: string;
  description: string;
  popularTracks: {
    id: string;
    title: string;
    duration: string;
    plays: string;
  }[];
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
    duration: '3:45',
    plays: '4,253',
    artist: 'GOGO Student Ensemble',
    cover: '/music/artists/gogo_students.jpg',
  });
  
  // Refs for animations
  const pageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const nowPlayingRef = useRef<HTMLDivElement>(null);
  
  // Initialize animations when the component mounts
  useEffect(() => {
    if (pageRef.current) {
      pageEnterAnimation(pageRef.current);
    }
    
    if (nowPlayingRef.current) {
      nowPlayingEnterAnimation(nowPlayingRef.current);
    }
  }, []);

  // Animate on route changes
  useEffect(() => {
    if (contentRef.current) {
      pageEnterAnimation(contentRef.current);
    }
  }, [location.pathname]);

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

  const handleArtistClick = (artistId: string) => {
    navigate(`/music/artist/${artistId}`);
  };

  // Playback control functions
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNextTrack = () => {
    // In a real app, this would play the next track
    // eslint-disable-next-line no-console
    console.log('Playing next track');
  };

  // Function to play a track from any component
  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };
  // Function to transform PopularTrack to Track
  const convertToTrack = (
    track: Track,
    artistName: string,
    artistImage: string,
  ): Track => {
    return {
      id: track.id,
      title: track.title,
      duration: track.duration,
      plays: track.plays,
      artist: artistName,
      cover: artistImage,
    };
  };

  return (
    <PageContainer ref={pageRef}>
      <Header>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Logo onClick={handleGoToHome}>GOGO Music</Logo>
          <Navigation>
            {location.pathname !== '/music' && (
              <BackButton onClick={handleGoBack}>
                <ArrowLeftIcon /> Back
              </BackButton>
            )}
          </Navigation>
        </div>
      </Header>

      <MainContent>
        <LeftSidebar>
          <NavItem
            className={location.pathname === '/music' ? 'active' : ''}
            onClick={handleGoToHome}
          >
            <HomeIcon /> Home
          </NavItem>
        </LeftSidebar>
        <RightContent>
          {isArtistView && currentArtist ? (
            <ArtistView
              artist={currentArtist}
              onPlayTrack={(track: Track) => {
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
              onPlayTrack={(track: PlaybackTrack) => {
                // Convert PlaybackTrack to Track if needed
                const fullTrack: Track = {
                  ...track,
                  plays: '0' // Add the missing plays property
                };
                playTrack(fullTrack);
              }}
            />
          )}
        </RightContent>
      </MainContent>
      <NowPlayingBar
        currentTrack={{
          ...currentTrack,
          artist: currentTrack?.artist || '',
          cover: currentTrack?.cover || ''
        }}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onNext={handleNextTrack}
      />
    </PageContainer>
  );
};

export default MusicPage;
