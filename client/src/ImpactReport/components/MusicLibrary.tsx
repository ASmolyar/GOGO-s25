import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import COLORS from '../../assets/colors';

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

// External Track interface for the Now Playing bar
interface PlaybackTrack {
  id: string;
  title: string;
  artist: string;
  cover: string;
  duration: string;
  audioSrc?: string;
}

interface MusicCatalog {
  albums: Album[];
}

interface MusicLibraryProps {
  onArtistClick: (artistId: string) => void;
  onPlayTrack: (track: PlaybackTrack) => void;
}

// Styled components
const MusicLibraryContainer = styled.div`
  width: 100%;
  max-width: 1800px;
  margin: 0 auto;
  padding: 24px 32px;
`;

const PageSection = styled.div`
  margin-bottom: 40px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin: 0;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 24px;
`;

const Card = styled.div`
  background: #181818;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: #282828;
  }
`;

const CardCover = styled.div<{ url: string }>`
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: 4px;
  background-image: url(${(props) => props.url});
  background-size: cover;
  background-position: center;
  margin-bottom: 16px;
  position: relative;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent);
    border-radius: 4px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::after {
    opacity: 1;
  }
`;

const PlayButton = styled.div`
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #1db954;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(8px);
  transition: all 0.3s ease;
  z-index: 2;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);

  ${Card}:hover & {
    opacity: 1;
    transform: translateY(0);
  }

  &:hover {
    transform: scale(1.1) !important;
    background: #1ed760;
  }
`;

const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardDescription = styled.p`
  font-size: 14px;
  color: #b3b3b3;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const NoAlbumsMessage = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #b3b3b3;
`;

// Featured Album Section
const FeaturedAlbumSection = styled.div`
  margin-bottom: 48px;
  padding: 24px;
  background: linear-gradient(
    135deg,
    #121212 0%,
    #1e1e1e 50%,
    ${COLORS.gogo_blue}22 100%
  );
  border-radius: 8px;
  display: flex;
  gap: 24px;
  position: relative;
  overflow: hidden;
`;

const FeaturedAlbumCover = styled.div<{ image: string }>`
  width: 232px;
  height: 232px;
  border-radius: 4px;
  background-image: url(${(props) => props.image});
  background-size: cover;
  background-position: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  flex-shrink: 0;
`;

const FeaturedAlbumInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const FeaturedAlbumBadge = styled.div`
  background-color: ${COLORS.gogo_blue};
  color: white;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FeaturedAlbumTitle = styled.h2`
  font-size: 32px;
  font-weight: 900;
  color: white;
  margin: 0 0 8px 0;
`;

const FeaturedAlbumArtist = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #b3b3b3;
  margin: 0 0 16px 0;
`;

const FeaturedAlbumDescription = styled.p`
  font-size: 14px;
  color: #b3b3b3;
  margin: 0 0 24px 0;
  line-height: 1.5;
  max-width: 700px;
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

function VerifiedIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="#3D91F4">
      <path d="M12 1a11 11 0 1 0 0 22 11 11 0 0 0 0-22zm5.045 8.866L11.357 16.9l-4.4-3.396a.75.75 0 1 1 .914-1.182l3.417 2.639 4.968-6.276a.749.749 0 0 1 1.185.918l-.003.004a.752.752 0 0 1-.136.177l-.258.326z" />
    </svg>
  );
}

// Main component
function MusicLibrary({
  onArtistClick,
  onPlayTrack,
}: MusicLibraryProps): JSX.Element {
  const [catalog, setCatalog] = useState<MusicCatalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();

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

  const handlePlayTrack = (track: CatalogTrack, albumCover: string) => {
    // Call the onPlayTrack prop to update the now playing bar
    onPlayTrack({
      id: track.id,
      title: track.title,
      artist: track.artist,
      cover: albumCover,
      duration: track.duration,
    });

    // Continue to handle local audio player if needed
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

  const handleAlbumClick = (albumId: string) => {
    navigate(`/music/album/${albumId}`);
  };

  if (loading) {
    return (
      <MusicLibraryContainer>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          Loading music catalog...
        </div>
      </MusicLibraryContainer>
    );
  }

  if (error) {
    return (
      <MusicLibraryContainer>
        <div style={{ textAlign: 'center', padding: '3rem', color: 'red' }}>
          {error}
        </div>
      </MusicLibraryContainer>
    );
  }

  if (!catalog || catalog.albums.length === 0) {
    return (
      <MusicLibraryContainer>
        <NoAlbumsMessage>No albums found in the music catalog.</NoAlbumsMessage>
      </MusicLibraryContainer>
    );
  }

  return (
    <MusicLibraryContainer>
      {/* Featured Album Banner */}
      <PageSection>
        <FeaturedAlbumSection>
          <FeaturedAlbumCover
            image="/music/albums/The Rain May Be Pouring (Guitars over Guns)/cover.jpg"
            onClick={() => handleAlbumClick('the_rain_may_be_pouring')}
            style={{ cursor: 'pointer' }}
          />
          <FeaturedAlbumInfo>
            <FeaturedAlbumBadge>Featured Album</FeaturedAlbumBadge>
            <FeaturedAlbumTitle
              onClick={() => handleAlbumClick('the_rain_may_be_pouring')}
              style={{ cursor: 'pointer' }}
            >
              The Rain May Be Pouring
            </FeaturedAlbumTitle>
            <FeaturedAlbumArtist>Guitars Over Guns</FeaturedAlbumArtist>
            <FeaturedAlbumDescription>
              Original pieces created by students and mentors from the Guitars
              Over Guns program, showcasing their talent, creativity, and
              musical growth.
            </FeaturedAlbumDescription>
            <div style={{ display: 'flex', gap: '16px' }}>
              <GreenPlayButton
                onClick={(e) => {
                  e.stopPropagation();
                  const album = catalog.albums.find(
                    (a) => a.id === 'the_rain_may_be_pouring',
                  );
                  if (album && album.tracks.length > 0) {
                    handlePlayTrack(album.tracks[0], album.coverImage);
                  }
                }}
                style={{ width: '48px', height: '48px' }}
              >
                ▶
              </GreenPlayButton>
              <button
                type="button"
                onClick={() => handleAlbumClick('the_rain_may_be_pouring')}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '4px',
                  padding: '8px 16px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              >
                VIEW ALBUM
              </button>
            </div>
          </FeaturedAlbumInfo>
        </FeaturedAlbumSection>
      </PageSection>

      {/* Albums section that auto-populates from catalog */}
      <PageSection>
        <SectionHeader>
          <SectionTitle>Our Albums</SectionTitle>
        </SectionHeader>

        <CardGrid>
          {catalog.albums.map((album) => (
            <Card key={album.id} onClick={() => handleAlbumClick(album.id)}>
              <CardCover url={album.coverImage}>
                <PlayButton
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent navigating to album page
                    if (album.tracks.length > 0) {
                      handlePlayTrack(album.tracks[0], album.coverImage);
                    }
                  }}
                >
                  ▶
                </PlayButton>
              </CardCover>
              <CardTitle>{album.title}</CardTitle>
              <CardDescription>{album.description}</CardDescription>
            </Card>
          ))}
        </CardGrid>
      </PageSection>

      {/* Artist section with hyperlinks */}
      <PageSection>
        <SectionHeader>
          <SectionTitle>GOGO Artists</SectionTitle>
        </SectionHeader>

        <CardGrid>
          <Card onClick={() => onArtistClick('caetano-veloso')}>
            <CardCover url="https://i.scdn.co/image/ab6761610000e5eb23960da5fab496188f9d5054" />
            <CardTitle>Caetano Veloso</CardTitle>
            <CardDescription>Artist</CardDescription>
          </Card>
          <Card onClick={() => onArtistClick('gogo-students')}>
            <CardCover url="/music/artists/gogo_students.jpg" />
            <CardTitle>GOGO Student Ensemble</CardTitle>
            <CardDescription>Artist</CardDescription>
          </Card>
          <Card onClick={() => onArtistClick('gogo-mentors')}>
            <CardCover url="/music/artists/gogo_mentors.jpg" />
            <CardTitle>GOGO Mentor Collective</CardTitle>
            <CardDescription>Artist</CardDescription>
          </Card>
        </CardGrid>
      </PageSection>
    </MusicLibraryContainer>
  );
}

export default MusicLibrary;
