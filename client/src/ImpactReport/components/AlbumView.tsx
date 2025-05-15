import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { animate, stagger } from 'animejs';
import COLORS from '../../assets/colors';
import { Album, Song } from '../types/music';
import { getAlbumById } from '../services/musicService';

// Helper function for image URL formatting
const formatImageUrl = (url: string): string => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('/')) return url;
  return `/${url}`;
};

interface AlbumViewProps {
  albumId: string;
  onPlayTrack: (song: Song, album: Album) => void;
  onBackClick: () => void;
  currentlyPlayingId?: string | null;
  isPlaying?: boolean;
}

// Styled components
const AlbumViewContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 24px;
  width: 100%;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  flex: 1;
`;

const AlbumHeader = styled.div`
  display: flex;
  padding: 32px 0;
  gap: 24px;
  margin-bottom: 32px;
`;

const AlbumCover = styled.div<{ imageUrl: string }>`
  width: 232px;
  height: 232px;
  background-image: ${(props) => `url(${formatImageUrl(props.imageUrl)})`};
  background-size: cover;
  background-position: center;
  box-shadow: 0 4px 60px rgba(0, 0, 0, 0.5);
  flex-shrink: 0;
`;

const AlbumInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const AlbumType = styled.div`
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 700;
  color: white;
  margin-bottom: 8px;
`;

const AlbumTitle = styled.h1`
  font-size: 4rem;
  font-weight: 900;
  color: white;
  margin: 0 0 16px 0;
  line-height: 1.1;
`;

const ArtistDisplay = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: white;
  margin-bottom: 8px;
`;

const AlbumMeta = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 24px;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
`;

const PlayButton = styled.button`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: ${COLORS.gogo_blue};
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 24px;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    background-color: ${COLORS.gogo_purple};
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  padding: 8px 0;
  transition: all 0.2s ease;

  &:hover {
    color: ${COLORS.gogo_blue};
  }
`;

const TracksContainer = styled.div`
  width: 100%;
`;

const TracksHeader = styled.div`
  display: grid;
  grid-template-columns: 40px 4fr 2fr 80px;
  padding: 0 16px 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 16px;
`;

const HeaderCell = styled.div`
  color: #b3b3b3;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.1em;
`;

const TrackRow = styled.div<{ isActive?: boolean; isHovered?: boolean }>`
  display: grid;
  grid-template-columns: 40px 4fr 2fr 80px;
  padding: 12px 16px;
  border-radius: 4px;
  align-items: center;
  cursor: pointer;
  background: ${(props) =>
    props.isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const TrackNumber = styled.div<{ isActive?: boolean }>`
  font-size: 16px;
  color: ${(props) => (props.isActive ? COLORS.gogo_blue : '#b3b3b3')};
  font-weight: 500;
  text-align: center;
`;

const TrackInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const TrackTitle = styled.div<{ isActive?: boolean }>`
  font-size: 16px;
  color: ${(props) => (props.isActive ? COLORS.gogo_blue : 'white')};
  font-weight: 500;
`;

const TrackArtist = styled.div`
  font-size: 14px;
  color: #b3b3b3;
`;

const TrackDuration = styled.div`
  text-align: right;
  font-size: 14px;
  color: #b3b3b3;
`;

const SidebarContainer = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 24px;
`;

const NowPlayingHeader = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: white;
  margin: 0 0 24px 0;
`;

const CurrentTrackInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const CurrentTrackCover = styled.div<{ url: string }>`
  width: 100%;
  aspect-ratio: 1/1;
  margin-bottom: 24px;
  background-image: ${(props) => `url(${formatImageUrl(props.url)})`};
  background-size: cover;
  background-position: center;
  border-radius: 4px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
`;

const CurrentTrackTitle = styled.h4`
  font-size: 18px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;
`;

const CurrentTrackArtist = styled.div`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 24px;
`;

const CreditsSection = styled.div`
  margin-top: 32px;
`;

const CreditsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const CreditsTitle = styled.h4`
  font-size: 16px;
  font-weight: 700;
  color: white;
  margin: 0;
`;

const ShowAllLink = styled.div`
  font-size: 14px;
  color: #b3b3b3;
  cursor: pointer;

  &:hover {
    color: white;
    text-decoration: underline;
  }
`;

const CreditsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CreditItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const CreditName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: white;
`;

const CreditRole = styled.div`
  font-size: 12px;
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

function ArrowLeftIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.292893 7.29289C-0.0976311 7.68342 -0.0976311 8.31658 0.292893 8.70711L6.65685 15.0711C7.04738 15.4616 7.68054 15.4616 8.07107 15.0711C8.46159 14.6805 8.46159 14.0474 8.07107 13.6569L2.41421 8L8.07107 2.34315C8.46159 1.95262 8.46159 1.31946 8.07107 0.928932C7.68054 0.538408 7.04738 0.538408 6.65685 0.928932L0.292893 7.29289ZM16 7H1V9H16V7Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z" />
    </svg>
  );
}

// Helper function to format duration in seconds to MM:SS format
const formatDuration = (seconds: number | undefined): string => {
  if (!seconds) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const AlbumView = ({
  albumId,
  onPlayTrack,
  onBackClick,
  currentlyPlayingId,
  isPlaying,
}: AlbumViewProps): JSX.Element => {
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);

  // refs for animation
  const headerRef = useRef<HTMLDivElement>(null);
  const tracksRef = useRef<HTMLDivElement>(null);
  const trackRowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        setLoading(true);
        const fetchedAlbum = await getAlbumById(albumId);

        if (!fetchedAlbum) {
          throw new Error(`Album with ID ${albumId} not found`);
        }

        // Format cover path if needed and ensure songs have durations
        const formattedAlbum = {
          ...fetchedAlbum,
          cover: formatImageUrl(fetchedAlbum.cover),
          songs: fetchedAlbum.songs.map((song) => ({
            ...song,
            // If song doesn't have duration, assign a default between 2:30 and 4:30
            duration: song.duration || 150 + Math.floor(Math.random() * 120),
          })),
        };

        console.log('Album details for display:', formattedAlbum);

        setAlbum(formattedAlbum);

        // If there are songs, set the first one as selected by default
        if (formattedAlbum.songs.length > 0) {
          setSelectedSong(formattedAlbum.songs[0]);
        }

        setLoading(false);

        // Animate elements after they're loaded
        setTimeout(() => {
          // Animate header
          if (headerRef.current) {
            animate(headerRef.current, {
              opacity: [0, 1],
              translateY: [20, 0],
              duration: 600,
            });
          }

          // Animate tracks container
          if (tracksRef.current) {
            animate(tracksRef.current, {
              opacity: [0, 1],
              translateY: [20, 0],
              duration: 600,
              delay: 200,
              easing: 'easeOutCubic',
            });
          }

          // Animate track rows with stagger
          const trackRows = trackRowRefs.current.filter(
            (row): row is HTMLDivElement => row !== null,
          );
          if (trackRows.length) {
            animate(trackRows, {
              opacity: [0, 1],
              translateX: [10, 0],
              duration: 500,
              delay: stagger(30),
              easing: 'easeOutCubic',
            });
          }

          // Animate sidebar
          if (sidebarRef.current) {
            animate(sidebarRef.current, {
              opacity: [0, 1],
              translateX: [20, 0],
              duration: 600,
              delay: 300,
              easing: 'easeOutCubic',
            });
          }
        }, 100);
      } catch (err) {
        console.error('Error loading album:', err);
        setError('Could not load the album. Please try again later.');
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [albumId]);

  const handlePlaySong = (song: Song) => {
    if (!album) return;

    // Set selected song and play it through the parent component
    setSelectedSong(song);
    onPlayTrack(song, album);
  };

  const handlePlayAlbum = () => {
    if (album && album.songs.length > 0) {
      handlePlaySong(album.songs[0]);
    }
  };

  // Track row ref handler for animations
  const setTrackRowRef = (el: HTMLDivElement | null, index: number) => {
    if (el) {
      while (trackRowRefs.current.length <= index) {
        trackRowRefs.current.push(null);
      }
      trackRowRefs.current[index] = el;
    }
  };

  if (loading) {
    return <LoadingContainer>Loading album...</LoadingContainer>;
  }

  if (error) {
    return <ErrorContainer>{error}</ErrorContainer>;
  }

  if (!album) {
    return <ErrorContainer>Album not found.</ErrorContainer>;
  }

  // Get formatted date
  const albumDate = new Date(album.date || album.release_date || '');
  const formattedDate = albumDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Get all artists from album
  const artistNames = album.artists.map((artist) => artist.name).join(', ');

  // Get total number of songs and duration
  const songCount = album.songs.length;

  return (
    <AlbumViewContainer>
      <MainContent>
        <BackButton onClick={onBackClick}>
          <ArrowLeftIcon /> Back
        </BackButton>

        <AlbumHeader ref={headerRef}>
          <AlbumCover imageUrl={album.cover} />
          <AlbumInfo>
            <AlbumType>{album.type.toUpperCase()}</AlbumType>
            <AlbumTitle>{album.name}</AlbumTitle>
            <ArtistDisplay>{artistNames}</ArtistDisplay>
            <AlbumMeta>
              {formattedDate} • {songCount} songs
            </AlbumMeta>
            <Controls>
              <PlayButton onClick={handlePlayAlbum}>▶</PlayButton>
            </Controls>
          </AlbumInfo>
        </AlbumHeader>

        <TracksContainer ref={tracksRef}>
          <TracksHeader>
            <HeaderCell>#</HeaderCell>
            <HeaderCell>TITLE</HeaderCell>
            <HeaderCell>ARTIST</HeaderCell>
            <HeaderCell style={{ textAlign: 'right' }}>DURATION</HeaderCell>
          </TracksHeader>

          {album.songs.map((song, index) => (
            <TrackRow
              key={song.song_id}
              ref={(el) => setTrackRowRef(el, index)}
              isActive={currentlyPlayingId === song.song_id}
              onClick={() => handlePlaySong(song)}
              onMouseEnter={() => setHoveredTrack(song.song_id)}
              onMouseLeave={() => setHoveredTrack(null)}
            >
              <TrackNumber isActive={currentlyPlayingId === song.song_id}>
                {currentlyPlayingId === song.song_id ? (
                  isPlaying ? (
                    <PauseIcon />
                  ) : (
                    <PlayIcon />
                  )
                ) : hoveredTrack === song.song_id ? (
                  <PlayIcon />
                ) : (
                  index + 1
                )}
              </TrackNumber>
              <TrackInfo>
                <TrackTitle isActive={currentlyPlayingId === song.song_id}>
                  {song.title}
                </TrackTitle>
              </TrackInfo>
              <TrackArtist>
                {song.artists.map((artist) => artist.name).join(', ')}
              </TrackArtist>
              <TrackDuration>{formatDuration(song.duration)}</TrackDuration>
            </TrackRow>
          ))}
        </TracksContainer>
      </MainContent>

      <SidebarContainer ref={sidebarRef}>
        {selectedSong && (
          <>
            <NowPlayingHeader>Now Playing</NowPlayingHeader>
            <CurrentTrackInfo>
              <CurrentTrackCover url={album.cover} />
              <CurrentTrackTitle>{selectedSong.title}</CurrentTrackTitle>
              <CurrentTrackArtist>
                {selectedSong.artists.map((artist) => artist.name).join(', ')}
              </CurrentTrackArtist>
            </CurrentTrackInfo>

            <CreditsSection>
              <CreditsHeader>
                <CreditsTitle>Credits</CreditsTitle>
                <ShowAllLink>Show all</ShowAllLink>
              </CreditsHeader>
              <CreditsList>
                {selectedSong.artists.map((artist) => (
                  <CreditItem key={artist.artist_id}>
                    <CreditName>{artist.name}</CreditName>
                    <CreditRole>Main Artist</CreditRole>
                  </CreditItem>
                ))}

                <CreditItem>
                  <CreditName>Daniel Hayoun</CreditName>
                  <CreditRole>Composer, Lyricist</CreditRole>
                </CreditItem>

                <CreditItem>
                  <CreditName>Chad Bernstein</CreditName>
                  <CreditRole>Producer</CreditRole>
                </CreditItem>
              </CreditsList>
            </CreditsSection>
          </>
        )}
      </SidebarContainer>
    </AlbumViewContainer>
  );
};

export default AlbumView;
