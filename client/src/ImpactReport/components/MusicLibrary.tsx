import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { animate, stagger } from 'animejs';
import COLORS from '../../assets/colors';
import { Album, Song, Artist } from '../types/music';
import { getAlbums, getAlbumById } from '../services/musicService';

interface MusicLibraryProps {
  onAlbumClick: (albumId: string) => void;
  onPlayTrack: (song: Song, album: Album) => void;
  onArtistClick?: (artistId: string) => void;
  currentlyPlayingId?: string | null;
  isPlaying?: boolean;
  modalState?: 'full' | 'pip' | 'minimized' | 'hidden';
}

// Helper function for image URL formatting
const formatImageUrl = (url: string): string => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('/')) return url;
  return `/${url}`;
};

// Helper function to safely get artist names from an album
const getArtistNames = (artists?: Artist[]): string => {
  if (!artists || !Array.isArray(artists) || artists.length === 0) {
    return 'Various Artists';
  }
  return artists.map((artist) => artist.name || 'Unknown Artist').join(', ');
};

// Styled components - optimized for Impact Report
const MusicLibraryContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageSection = styled.div`
  margin-bottom: 3.5rem;
  opacity: 0; // Start hidden for animation
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
  margin: 0;
  letter-spacing: -0.01em;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.5rem;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0; // Start hidden for animation

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-5px);
  }
`;

const CardCover = styled.div<{ url: string }>`
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: 6px;
  background-image: ${(props) => `url(${formatImageUrl(props.url)})`};
  background-size: cover;
  background-position: center;
  margin-bottom: 1rem;
  position: relative;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
    border-radius: 6px;
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
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${COLORS.gogo_blue};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(8px);
  transition: all 0.3s ease;
  z-index: 2;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);

  ${Card}:hover & {
    opacity: 1;
    transform: translateY(0);
  }

  &:hover {
    transform: scale(1.1) !important;
    background: ${COLORS.gogo_purple};
  }
`;

const CardTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardDescription = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ArtistText = styled.span`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
`;

const NoAlbumsMessage = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
`;

// Featured Album Section - more emphasis for Impact Report
const FeaturedAlbumSection = styled.div`
  margin-bottom: 2rem;
  padding: 2rem;
  background: linear-gradient(
    135deg,
    rgba(25, 70, 245, 0.2) 0%,
    rgba(190, 43, 147, 0.2) 100%
  );
  border-radius: 12px;
  display: flex;
  gap: 2rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const FeaturedAlbumCover = styled.div<{ image: string }>`
  width: 180px;
  height: 180px;
  border-radius: 8px;
  background-image: ${(props) => `url(${formatImageUrl(props.image)})`};
  background-size: cover;
  background-position: center;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
  flex-shrink: 0;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const FeaturedAlbumInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const FeaturedAlbumBadge = styled.div`
  display: inline-block;
  background: ${COLORS.gogo_green};
  color: #121212;
  font-size: 0.8rem;
  font-weight: bold;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  margin-bottom: 0.75rem;
  align-self: flex-start;
`;

const FeaturedAlbumTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0 0 0.25rem 0;
  color: white;
  transition: color 0.2s ease;

  &:hover {
    color: ${COLORS.gogo_blue};
  }
`;

const FeaturedAlbumArtist = styled.h4`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 1rem 0;
  font-weight: 600;
`;

const FeaturedAlbumDescription = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 1.5rem;
`;

const GreenPlayButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${COLORS.gogo_blue};
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
  box-shadow: 0 8px 16px rgba(25, 70, 245, 0.4);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    background-color: ${COLORS.gogo_purple};
    box-shadow: 0 10px 20px rgba(25, 70, 245, 0.6);
  }
`;

const ViewAlbumButton = styled.button`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 0.6rem 1.2rem;
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    border-color: white;
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
`;

function MusicLibrary({
  onAlbumClick,
  onPlayTrack,
  currentlyPlayingId,
  isPlaying,
  onArtistClick,
  modalState = 'full',
}: MusicLibraryProps): JSX.Element {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();

  // Move the useMemo hook here, before any conditional returns
  // It will use an empty array if albums is empty
  const featuredAlbum = React.useMemo(() => {
    if (albums.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * albums.length);
    return albums[randomIndex];
  }, [albums]);

  // Refs for animation
  const featuredSectionRef = useRef<HTMLDivElement>(null);
  const albumsSectionRef = useRef<HTMLDivElement>(null);
  const albumCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Check if we're in PIP mode
  const isPip = modalState === 'pip';

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        setLoading(true);
        // Get all albums
        const fetchedAlbums = await getAlbums();
        if (fetchedAlbums.length > 0) {
          // Debug album cover paths
          console.log('Albums loaded:', fetchedAlbums);

          // Make sure album covers have absolute paths
          const albumsWithFormattedCovers = fetchedAlbums.map((album) => {
            // Ensure artists array is always defined
            const artists = album.artists || [];

            // If cover doesn't start with http or /, add leading /
            if (
              album.cover &&
              !album.cover.startsWith('http') &&
              !album.cover.startsWith('/')
            ) {
              return {
                ...album,
                cover: `/${album.cover}`,
                artists,
              };
            }
            // Handle the case where cover is undefined
            if (!album.cover) {
              return {
                ...album,
                cover: '/music/albums/default-cover.jpg', // Default cover image
                artists,
              };
            }
            return {
              ...album,
              artists,
            };
          });

          setAlbums(albumsWithFormattedCovers);
        } else {
          throw new Error('No albums found in the music catalog');
        }

        // After albums load, animate the sections
        setTimeout(() => {
          // Animate featured section
          if (featuredSectionRef.current) {
            try {
              animate(featuredSectionRef.current, {
                opacity: [0, 1],
                translateY: [30, 0],
                duration: 800,
                easing: 'easeOutExpo',
              });
            } catch (error) {
              console.error('Error animating featured section:', error);
            }
          }

          // Animate albums section with delay
          if (albumsSectionRef.current) {
            try {
              animate(albumsSectionRef.current, {
                opacity: [0, 1],
                translateY: [30, 0],
                duration: 800,
                delay: 200,
                easing: 'easeOutExpo',
              });
            } catch (error) {
              console.error('Error animating albums section:', error);
            }
          }

          // Animate album cards with stagger effect
          const validAlbumRefs = albumCardRefs.current.filter(
            (ref): ref is HTMLDivElement => ref !== null,
          );
          if (validAlbumRefs.length > 0) {
            try {
              animate(validAlbumRefs, {
                opacity: [0, 1],
                translateY: [20, 0],
                scale: [0.95, 1],
                duration: 600,
                delay: stagger(50),
                easing: 'easeOutCubic',
              });
            } catch (error) {
              console.error('Error animating album cards:', error);
            }
          }
        }, 300);
      } catch (err) {
        console.error('Error loading music albums:', err);
        setError('Could not load the music catalog. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();

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

  const handleAlbumClick = (albumId: string) => {
    // Just pass the album ID to the parent component handler
    onAlbumClick(albumId);
  };

  const handlePlayAlbum = (album: Album) => {
    if (album && album.songs && album.songs.length > 0) {
      const firstSong = album.songs[0];
      // Call the onPlayTrack prop to update the now playing bar
      onPlayTrack(firstSong, album);
    }
  };

  // Reference setter for card animations
  const setCardRef = (el: HTMLDivElement | null, index: number) => {
    if (el) {
      // Ensure the array has enough space
      while (albumCardRefs.current.length <= index) {
        albumCardRefs.current.push(null);
      }
      albumCardRefs.current[index] = el;
    }
  };

  if (loading) {
    return (
      <MusicLibraryContainer>
        <div
          style={{
            textAlign: 'center',
            padding: '3rem',
            color: 'rgba(255, 255, 255, 0.7)',
          }}
        >
          Loading music catalog...
        </div>
      </MusicLibraryContainer>
    );
  }

  if (error) {
    return (
      <MusicLibraryContainer>
        <div
          style={{
            textAlign: 'center',
            padding: '3rem',
            color: COLORS.gogo_pink,
          }}
        >
          {error}
        </div>
      </MusicLibraryContainer>
    );
  }

  if (albums.length === 0) {
    return (
      <MusicLibraryContainer>
        <NoAlbumsMessage>No albums found in the music catalog.</NoAlbumsMessage>
      </MusicLibraryContainer>
    );
  }

  // Get a formatted date string for the album
  const albumDate = new Date(featuredAlbum!.date);
  const formattedDate = albumDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <MusicLibraryContainer>
      {/* Featured Album Banner - only show in full mode */}
      {!isPip && featuredAlbum && (
        <PageSection ref={featuredSectionRef}>
          <SectionHeader>
            <SectionTitle>Featured Album</SectionTitle>
          </SectionHeader>

          <FeaturedAlbumSection>
            <FeaturedAlbumCover image={featuredAlbum.cover} />
            <FeaturedAlbumInfo>
              <CardTitle style={{ fontSize: '2rem' }}>
                {featuredAlbum.name}
              </CardTitle>
              <ArtistText style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                {getArtistNames(featuredAlbum.artists)}
              </ArtistText>
              <CardDescription style={{ marginBottom: '1.5rem' }}>
                Released: {formattedDate}
              </CardDescription>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <GreenPlayButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayAlbum(featuredAlbum);
                  }}
                >
                  ▶
                </GreenPlayButton>
                <ViewAlbumButton
                  onClick={() => handleAlbumClick(featuredAlbum.album_id)}
                >
                  View Album
                </ViewAlbumButton>
              </div>
            </FeaturedAlbumInfo>
          </FeaturedAlbumSection>
        </PageSection>
      )}

      {/* Albums Section - always show */}
      <PageSection
        ref={albumsSectionRef}
        style={isPip ? { marginTop: '10px' } : {}}
      >
        {!isPip && (
          <SectionHeader>
            <SectionTitle>Albums</SectionTitle>
          </SectionHeader>
        )}

        <CardGrid>
          {albums.map((album, index) => (
            <Card
              key={album.album_id}
              ref={(el) => setCardRef(el, index)}
              onClick={() => handleAlbumClick(album.album_id)}
            >
              <CardCover url={album.cover}>
                <PlayButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayAlbum(album);
                  }}
                >
                  ▶
                </PlayButton>
              </CardCover>
              <CardTitle>{album.name}</CardTitle>
            </Card>
          ))}
        </CardGrid>
      </PageSection>
    </MusicLibraryContainer>
  );
}

export default MusicLibrary;
