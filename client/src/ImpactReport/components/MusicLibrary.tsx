import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import COLORS from '../../assets/colors.ts';

// Types for the music catalog
interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  file: string;
}

interface Album {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  year: string;
  tracks: Track[];
}

interface MusicCatalog {
  albums: Album[];
}

// Styled components
const MusicLibraryContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 2rem;
  text-align: center;
  color: ${COLORS.gogo_blue};
`;

const AlbumsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const AlbumCard = styled.div`
  background: rgba(35, 35, 40, 0.7);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
  }
`;

const AlbumCover = styled.div<{ coverUrl: string }>`
  width: 100%;
  padding-top: 100%; /* 1:1 Aspect Ratio */
  background-image: url(${props => props.coverUrl});
  background-size: cover;
  background-position: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 50%);
    pointer-events: none;
  }
`;

const AlbumInfo = styled.div`
  padding: 1.5rem;
`;

const AlbumTitle = styled.h3`
  font-size: 1.4rem;
  margin: 0 0 0.5rem;
  color: white;
  font-weight: 700;
`;

const AlbumDescription = styled.p`
  font-size: 0.9rem;
  color: #b3b3b3;
  margin: 0 0 1rem;
`;

const AlbumYear = styled.span`
  display: inline-block;
  background-color: ${COLORS.gogo_blue};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const TracksList = styled.div`
  margin-top: 1.5rem;
`;

const TrackItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

const TrackPlayButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${COLORS.gogo_blue};
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  cursor: pointer;
  
  &:hover {
    transform: scale(1.1);
    background-color: ${COLORS.gogo_pink};
  }
`;

const TrackInfo = styled.div`
  flex: 1;
`;

const TrackTitle = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: white;
`;

const TrackArtist = styled.div`
  font-size: 0.85rem;
  color: #b3b3b3;
`;

const TrackDuration = styled.div`
  font-size: 0.9rem;
  color: #b3b3b3;
  margin-left: 1rem;
`;

const NoAlbumsMessage = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #b3b3b3;
`;

// Main component
const MusicLibrary: React.FC = () => {
  const [catalog, setCatalog] = useState<MusicCatalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const response = await fetch('/music/catalog.json');
        if (!response.ok) {
          throw new Error('Failed to load music catalog');
        }
        const data = await response.json();
        setCatalog(data);
      } catch (err) {
        console.error('Error loading music catalog:', err);
        setError('Could not load the music catalog. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
    
    // Initialize audio element
    audioRef.current = new Audio();
    
    return () => {
      // Clean up audio when component unmounts
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const handlePlayTrack = (trackFile: string) => {
    if (audioRef.current) {
      // If the same track is clicked, toggle play/pause
      if (currentlyPlaying === trackFile) {
        if (audioRef.current.paused) {
          audioRef.current.play();
        } else {
          audioRef.current.pause();
        }
      } else {
        // Play a new track
        audioRef.current.src = trackFile;
        audioRef.current.play();
        setCurrentlyPlaying(trackFile);
      }
    }
  };

  if (loading) {
    return (
      <MusicLibraryContainer>
        <SectionTitle>Music Library</SectionTitle>
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading music catalog...</div>
      </MusicLibraryContainer>
    );
  }

  if (error) {
    return (
      <MusicLibraryContainer>
        <SectionTitle>Music Library</SectionTitle>
        <div style={{ textAlign: 'center', padding: '3rem', color: 'red' }}>{error}</div>
      </MusicLibraryContainer>
    );
  }

  if (!catalog || catalog.albums.length === 0) {
    return (
      <MusicLibraryContainer>
        <SectionTitle>Music Library</SectionTitle>
        <NoAlbumsMessage>No albums found in the music catalog.</NoAlbumsMessage>
      </MusicLibraryContainer>
    );
  }

  return (
    <MusicLibraryContainer>
      <SectionTitle>Music Library</SectionTitle>
      <AlbumsGrid>
        {catalog.albums.map((album) => (
          <AlbumCard key={album.id}>
            <AlbumCover 
              coverUrl={album.coverImage} 
              // Fallback image if cover not found
              onError={(e: React.SyntheticEvent<HTMLDivElement, Event>) => {
                const target = e.target as HTMLElement;
                target.style.backgroundImage = `url('https://placehold.co/500x500/171717/b3b3b3?text=${album.title}')`;
              }}
            />
            <AlbumInfo>
              <AlbumTitle>{album.title}</AlbumTitle>
              <AlbumDescription>{album.description}</AlbumDescription>
              <AlbumYear>{album.year}</AlbumYear>
              
              <TracksList>
                {album.tracks.map((track) => (
                  <TrackItem key={track.id}>
                    <TrackPlayButton 
                      onClick={() => handlePlayTrack(track.file)}
                      aria-label={`Play ${track.title}`}
                    >
                      {currentlyPlaying === track.file ? '■' : '▶'}
                    </TrackPlayButton>
                    <TrackInfo>
                      <TrackTitle>{track.title}</TrackTitle>
                      <TrackArtist>{track.artist}</TrackArtist>
                    </TrackInfo>
                    <TrackDuration>{track.duration}</TrackDuration>
                  </TrackItem>
                ))}
              </TracksList>
            </AlbumInfo>
          </AlbumCard>
        ))}
      </AlbumsGrid>
    </MusicLibraryContainer>
  );
};

export default MusicLibrary; 