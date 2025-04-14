import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import COLORS from '../../assets/colors.ts';

// Internal Track interface for the music catalog
interface CatalogTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  file: string;
}

// Album interface using CatalogTrack
interface Album {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  year: string;
  tracks: CatalogTrack[];
}

interface MusicCatalog {
  albums: Album[];
}

interface AlbumPageProps {
  onPlayTrack: (track: {
    id: string;
    title: string;
    artist: string;
    cover: string;
    duration: string;
  }) => void;
}

// Styled components
const PageContainer = styled.div`
  width: 100%;
  padding: 0 32px;
`;

const HeaderContainer = styled.div`
  position: relative;
  padding-bottom: 24px;
  margin-bottom: 24px;
`;

const HeaderBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 300px;
  background: linear-gradient(to bottom, #5038a0, #121212);
  z-index: 0;
  border-radius: 8px 8px 0 0;
`;

const HeaderContent = styled.div`
  position: relative;
  z-index: 1;
  padding: 32px;
  display: flex;
  align-items: flex-end;
  gap: 24px;
`;

const AlbumCover = styled.div<{ imageUrl: string }>`
  width: 232px;
  height: 232px;
  background-image: url(${props => props.imageUrl});
  background-size: cover;
  background-position: center;
  box-shadow: 0 4px 60px rgba(0, 0, 0, 0.5);
`;

const AlbumInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const AlbumType = styled.div`
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 700;
  color: white;
  margin-bottom: 8px;
`;

const AlbumTitle = styled.h1`
  font-size: 72px;
  font-weight: 900;
  color: white;
  margin: 0 0 16px 0;
  line-height: 1;
`;

const AlbumDescription = styled.div`
  color: #b3b3b3;
  font-size: 14px;
  margin-bottom: 24px;
`;

const AlbumMeta = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #b3b3b3;
  gap: 4px;
`;

const AlbumYear = styled.span`
  font-weight: 500;
  color: white;
`;

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 8px;
`;

const GreenPlayButton = styled.button`
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

const TracksContainer = styled.div`
  padding: 0 32px;
`;

const TracksHeader = styled.div`
  display: grid;
  grid-template-columns: 40px 4fr 80px;
  padding: 0 16px 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 16px;
`;

const TracksHeaderCell = styled.div`
  color: #b3b3b3;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 500;
`;

const TrackRow = styled.div`
  display: grid;
  grid-template-columns: 40px 4fr 80px;
  padding: 8px 16px;
  border-radius: 4px;
  align-items: center;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const TrackNumber = styled.div`
  font-size: 16px;
  color: #b3b3b3;
`;

const TrackInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const TrackTitle = styled.div`
  font-size: 16px;
  color: white;
  font-weight: 500;
`;

const TrackArtist = styled.div`
  font-size: 14px;
  color: #b3b3b3;
`;

const TrackDuration = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 14px;
  color: #b3b3b3;
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 3rem;
  color: #b3b3b3;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 3rem;
  color: #ff5555;
`;

const NotFoundContainer = styled.div`
  text-align: center;
  padding: 3rem;
  color: #b3b3b3;
`;

const VerifiedIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#3D91F4">
    <path d="M12 1a11 11 0 1 0 0 22 11 11 0 0 0 0-22zm5.045 8.866L11.357 16.9l-4.4-3.396a.75.75 0 1 1 .914-1.182l3.417 2.639 4.968-6.276a.749.749 0 0 1 1.185.918l-.003.004a.752.752 0 0 1-.136.177l-.258.326z" />
  </svg>
);

const AlbumPage: React.FC<AlbumPageProps> = ({ onPlayTrack }) => {
  const { albumId } = useParams<{ albumId: string }>();
  const navigate = useNavigate();
  const [catalog, setCatalog] = useState<MusicCatalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [album, setAlbum] = useState<Album | null>(null);
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
        
        // Find the album based on the albumId
        const foundAlbum = data.albums.find((a: Album) => a.id === albumId);
        if (foundAlbum) {
          setAlbum(foundAlbum);
        }
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
  }, [albumId]);

  const handlePlayTrack = (track: CatalogTrack) => {
    if (!album) return;
    
    // Call the onPlayTrack prop to update the now playing bar
    onPlayTrack({
      id: track.id,
      title: track.title,
      artist: track.artist,
      cover: album.coverImage,
      duration: track.duration
    });
    
    // Handle local audio player
    if (audioRef.current) {
      // If the same track is clicked, toggle play/pause
      if (currentlyPlaying === track.file) {
        if (audioRef.current.paused) {
          audioRef.current.play();
        } else {
          audioRef.current.pause();
        }
      } else {
        // Play a new track
        audioRef.current.src = track.file;
        audioRef.current.play();
        setCurrentlyPlaying(track.file);
      }
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        Loading album...
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        {error}
      </ErrorContainer>
    );
  }

  if (!album) {
    return (
      <NotFoundContainer>
        Album not found. <a href="/music">Return to music library</a>
      </NotFoundContainer>
    );
  }

  return (
    <PageContainer>
      <HeaderContainer>
        <HeaderBackground />
        <HeaderContent>
          <AlbumCover imageUrl={album.coverImage} />
          <AlbumInfo>
            <AlbumType>Album</AlbumType>
            <AlbumTitle>{album.title}</AlbumTitle>
            <AlbumDescription>{album.description}</AlbumDescription>
            <AlbumMeta>
              <span>{album.tracks.length} songs • </span>
              <AlbumYear>{album.year}</AlbumYear>
            </AlbumMeta>
            <HeaderControls>
              <GreenPlayButton onClick={() => {
                if (album.tracks.length > 0) {
                  handlePlayTrack(album.tracks[0]);
                }
              }}>▶</GreenPlayButton>
            </HeaderControls>
          </AlbumInfo>
        </HeaderContent>
      </HeaderContainer>
      
      <TracksContainer>
        <TracksHeader>
          <TracksHeaderCell>#</TracksHeaderCell>
          <TracksHeaderCell>Title</TracksHeaderCell>
          <TracksHeaderCell style={{ textAlign: 'right' }}>Duration</TracksHeaderCell>
        </TracksHeader>
        
        {album.tracks.map((track, index) => (
          <TrackRow key={track.id} onClick={() => handlePlayTrack(track)}>
            <TrackNumber>{currentlyPlaying === track.file ? '▶' : index + 1}</TrackNumber>
            <TrackInfo>
              <TrackTitle>{track.title}</TrackTitle>
              <TrackArtist>{track.artist}</TrackArtist>
            </TrackInfo>
            <TrackDuration>{track.duration}</TrackDuration>
          </TrackRow>
        ))}
      </TracksContainer>
    </PageContainer>
  );
};

export default AlbumPage; 