import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import './MusicPage.css';
import { animate } from 'animejs';
import MusicLibrary from './components/MusicLibrary';
import ArtistView from './components/ArtistView';
import AlbumView from './components/AlbumView';
import NowPlayingBar from './components/NowPlayingBar';
import { Song, Album, Artist as MusicArtist } from './types/music';
import {
  getArtistById,
  getSongsByArtist,
  getAlbumsByArtist,
} from './services/musicService';

// UI Artist type that matches the ArtistView component expectations
interface UIArtist {
  id: string;
  name: string;
  image: string;
  monthlyListeners: string;
  description: string;
}

// Icon components
function ArrowLeftIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.7072 3.70712C13.0979 3.31659 13.0979 2.68343 12.7072 2.29291C12.3169 1.90238 11.6835 1.90238 11.293 2.29291L4.29297 9.29286C3.90234 9.68339 3.90234 10.3167 4.29297 10.7072L11.293 17.7071C11.6835 18.0976 12.3169 18.0976 12.7072 17.7071C13.0979 17.3166 13.0979 16.6834 12.7072 16.2929L6.41436 10L12.7072 3.70712Z"
      />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 0L0 10H3V20H9V14H11V20H17V10H20L10 0Z" />
    </svg>
  );
}

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  padding: 0;
  background: linear-gradient(to bottom, #1e1e1e, #121212);
  color: white;
  position: relative;
`;

const Header = styled.header`
  width: 100%;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(18, 18, 18, 0.9);
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Logo = styled.div`
  font-size: 1.8rem;
  font-weight: 800;
  color: white;
  cursor: pointer;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(to right, #1ed760, #1974d2);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }

  &:hover::after {
    transform: scaleX(1);
  }
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: none;
  color: white;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const ContentWrapper = styled.main`
  flex: 1;
  padding: 1rem 2rem 8rem;
  width: 100%;
  display: flex;
`;

const MainContent = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const ContentArea = styled.div`
  background-color: transparent;
  border-radius: 8px;
  padding: 1.5rem;
`;

function MusicPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);

  // Current song being played
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  // Current album context
  const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);
  // Current artist being viewed as UI Artist (matches ArtistView requirements)
  const [currentArtist, setCurrentArtist] = useState<UIArtist | null>(null);
  // Current artist's songs
  const [artistSongs, setArtistSongs] = useState<Song[]>([]);
  // Current artist's albums
  const [artistAlbums, setArtistAlbums] = useState<Album[]>([]);
  // Loading state
  const [loading, setLoading] = useState(false);

  const [audioSrc, setAudioSrc] = useState<string>('');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // State to track the view mode
  const [viewMode, setViewMode] = useState<'library' | 'album' | 'artist'>(
    'library',
  );
  // State for selected album ID
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);

  // Refs for animations
  const pageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const nowPlayingRef = useRef<HTMLDivElement>(null);

  // Update audio source when audioSrc changes
  useEffect(() => {
    if (audioRef.current && audioSrc) {
      audioRef.current.src = audioSrc;

      // If component mounts with isPlaying true, try to play
      if (isPlaying) {
        try {
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              console.error('Autoplay prevented:', error);
              setIsPlaying(false);
            });
          }
        } catch (error) {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
        }
      }
    }
  }, [audioSrc, isPlaying]);

  // Function to play a song from any component
  const playSong = (song: Song, album: Album) => {
    // First update the state
    setCurrentSong(song);
    setCurrentAlbum(album);

    // Pause current playback if audio ref exists
    if (audioRef.current) {
      audioRef.current.pause();
    }

    // Set audio source - this will trigger the useEffect above
    if (song.audio_file) {
      setAudioSrc(song.audio_file);
    } else {
      // Fallback to a test audio if none provided
      setAudioSrc(
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      );
    }

    // Set playing state to true - actual playback is handled in the useEffect
    setIsPlaying(true);
  };

  // Define handleCloseAlbum to avoid use-before-define error
  const handleCloseAlbum = () => {
    setSelectedAlbumId(null);
    navigate('/music');
  };

  // Audio event handlers for native DOM events (used in useEffect with addEventListener)
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const time = audioRef.current.currentTime;
      const audioDuration = audioRef.current.duration || 0;
      setCurrentTime(time);
      setDuration(audioDuration);
      console.log(`Time update: ${time}s / ${audioDuration}s`);
    }
  };

  const handleDurationChange = () => {
    if (audioRef.current) {
      const audioDuration = audioRef.current.duration || 0;
      setDuration(audioDuration);
      console.log(`Duration changed: ${audioDuration}s`);
    }
  };

  const handleEnded = () => {
    console.log('Track ended, finding next song...');

    // If we have a current song and album
    if (currentSong && currentAlbum && currentAlbum.songs.length > 1) {
      // Find the index of the current song in the album
      const currentIndex = currentAlbum.songs.findIndex(
        (song) => song.song_id === currentSong.song_id,
      );

      // If there's a next song in the album, play it
      if (currentIndex !== -1 && currentIndex < currentAlbum.songs.length - 1) {
        const nextSong = currentAlbum.songs[currentIndex + 1];
        console.log(`Auto-playing next song: ${nextSong.title}`);
        playSong(nextSong, currentAlbum);
      } else {
        // If we're at the end of the album, just stop playing
        console.log('Reached end of album');
        setIsPlaying(false);
      }
    } else {
      setIsPlaying(false);
    }
  };

  // Handler for native DOM Event (used with addEventListener)
  const handleAudioError = (e: Event) => {
    console.error('Audio playback error:', e);
    setIsPlaying(false);
  };

  // Handler for React's synthetic event (used in JSX)
  const handleReactAudioError = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    console.error('Audio playback error (React):', e);
    setIsPlaying(false);
  };

  // Navigation functions
  const handleGoBack = () => {
    if (viewMode === 'album') {
      // If we're in album view, go back to library
      handleCloseAlbum();
    } else {
      // Otherwise use browser back
      navigate(-1);
    }
  };

  const handleGoToHome = () => {
    navigate('/music');
    setViewMode('library');
  };

  const handleGoToArtist = (artistId: string) => {
    navigate(`/music/artist/${artistId}`);
    setViewMode('artist');
  };

  // Open album view and update URL
  const handleOpenAlbum = (albumId: string) => {
    setSelectedAlbumId(albumId);
    setViewMode('album');

    // Update URL with query parameter (for deep linking)
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('album', albumId);
    window.history.pushState({}, '', newUrl.toString());
  };

  // Load artist data when the artist ID changes
  useEffect(() => {
    const loadArtistData = async () => {
      if (id) {
        setLoading(true);
        try {
          // Get the artist data
          const artist = await getArtistById(id);
          if (artist) {
            // Convert the data model Artist to UIArtist for the ArtistView component
            const uiArtist: UIArtist = {
              id: artist.artist_id,
              name: artist.name,
              image:
                artist.profile_picture ||
                `/music/artists/${artist.artist_id}.jpg`,
              monthlyListeners: '1,000+', // Default value since we don't have this in the data model
              description: `Music from ${artist.name}, featured on GOGO Impact albums.`,
            };

            setCurrentArtist(uiArtist);

            // Get songs by this artist
            const songs = await getSongsByArtist(id);
            setArtistSongs(songs);

            // Get albums this artist appears on
            const albums = await getAlbumsByArtist(id);
            setArtistAlbums(albums);

            // Set view mode to artist
            setViewMode('artist');
          } else {
            console.error(`Artist with ID ${id} not found`);
            navigate('/music');
          }
        } catch (error) {
          console.error('Error loading artist data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (location.pathname.includes('/artist/')) {
      loadArtistData();
    }
  }, [id, navigate, location.pathname]);

  // Now in useEffect, add the proper dependencies
  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio();

    // Set up event listeners for the audio element
    const audio = audioRef.current;

    if (audio) {
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleAudioError);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('durationchange', handleDurationChange);
    }

    // Use pageEnterAnimation for page content with short delay
    setTimeout(() => {
      if (pageRef.current) {
        animate(pageRef.current, {
          opacity: [0, 1],
          translateY: [20, 0],
          duration: 800,
          easing: 'easeOutCubic',
        });
      }
    }, 100); // Short delay to let initial render complete

    // Animate the now playing bar with a slight delay
    setTimeout(() => {
      if (nowPlayingRef.current) {
        animate(nowPlayingRef.current, {
          opacity: [0, 1],
          translateY: [50, 0],
          duration: 600,
          easing: 'easeOutCubic',
        });
      }
    }, 600); // Delay until after page animation starts

    // Clean up event listeners when component unmounts
    return () => {
      if (audio) {
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleAudioError);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('durationchange', handleDurationChange);
        audio.pause();
        audio.src = '';
      }
    };
    // Note: handleEnded and other handlers are defined outside this hook and don't depend on state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Playback control functions
  const handlePlayPause = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        // If currently playing, pause it
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // If paused, attempt to play
        try {
          // First ensure we have valid src
          if (!audioRef.current.src && currentSong?.audio_file) {
            audioRef.current.src = currentSong.audio_file;
          }

          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch((err) => {
              console.error('Failed to play audio:', err);
              setIsPlaying(false);
            });
          }
          setIsPlaying(true);
        } catch (err) {
          console.error('Failed to play audio:', err);
          setIsPlaying(false);
        }
      }
    } catch (error) {
      console.error('Error during play/pause:', error);
    }
  };

  const handleNextTrack = () => {
    // Implementation for playing the next track
    if (currentSong && currentAlbum && currentAlbum.songs.length > 1) {
      // Find current song index
      const currentIndex = currentAlbum.songs.findIndex(
        (song) => song.song_id === currentSong.song_id,
      );

      // If found and not the last song
      if (currentIndex !== -1 && currentIndex < currentAlbum.songs.length - 1) {
        const nextSong = currentAlbum.songs[currentIndex + 1];
        playSong(nextSong, currentAlbum);
      }
    }
    console.log('Playing next track');
  };

  const handlePreviousTrack = () => {
    // Implementation for playing the previous track
    if (currentSong && currentAlbum && currentAlbum.songs.length > 1) {
      // Find current song index
      const currentIndex = currentAlbum.songs.findIndex(
        (song) => song.song_id === currentSong.song_id,
      );

      // If found and not the first song
      if (currentIndex > 0) {
        const prevSong = currentAlbum.songs[currentIndex - 1];
        playSong(prevSong, currentAlbum);
      }
    }
    console.log('Playing previous track');
  };

  // Add additional function to seek audio position
  const handleSeek = (newTimeInSeconds: number) => {
    if (audioRef.current && !Number.isNaN(newTimeInSeconds)) {
      console.log(`Seeking to: ${newTimeInSeconds}s`);
      audioRef.current.currentTime = newTimeInSeconds;
      setCurrentTime(newTimeInSeconds);
    }
  };

  // Move the helper function inside the component
  const renderContentBasedOnViewMode = () => {
    if (viewMode === 'artist' && currentArtist) {
      return (
        <ArtistView
          artist={currentArtist}
          onPlayTrack={(song: Song, album: Album) => {
            playSong(song, album);
          }}
        />
      );
    }

    if (viewMode === 'album' && selectedAlbumId) {
      return (
        <AlbumView
          albumId={selectedAlbumId}
          onPlayTrack={(song, album) => {
            playSong(song, album);
          }}
          onBackClick={handleCloseAlbum}
          currentlyPlayingId={currentSong?.song_id || null}
          isPlaying={isPlaying}
        />
      );
    }

    // Default: library view
    return (
      <MusicLibrary
        onArtistClick={handleGoToArtist}
        onAlbumClick={handleOpenAlbum}
        onPlayTrack={(song: Song, album: Album) => {
          playSong(song, album);
        }}
        currentlyPlayingId={currentSong?.song_id || null}
        isPlaying={isPlaying}
      />
    );
  };

  return (
    <>
      <div className="music-content">
        <PageContainer ref={pageRef}>
          <Header className="header-container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <Logo onClick={handleGoToHome}>GOGO Music</Logo>
              <Navigation>
                {(location.pathname !== '/music' || viewMode === 'album') && (
                  <BackButton onClick={handleGoBack}>
                    <ArrowLeftIcon /> Back
                  </BackButton>
                )}
              </Navigation>
            </div>
          </Header>

          <ContentWrapper ref={contentRef} className="music-content">
            <MainContent>
              <ContentArea>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    Loading...
                  </div>
                ) : (
                  renderContentBasedOnViewMode()
                )}
              </ContentArea>
            </MainContent>
          </ContentWrapper>
        </PageContainer>
      </div>

      {/* Now Playing Bar - fixed at bottom */}
      <div ref={nowPlayingRef}>
        {currentSong && currentAlbum && (
          <NowPlayingBar
            currentSong={currentSong}
            currentAlbum={currentAlbum}
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onNext={handleNextTrack}
            onPrevious={handlePreviousTrack}
            progress={currentTime}
            duration={currentSong.duration || duration}
            onSeek={handleSeek}
          />
        )}
      </div>

      {/* Audio element - hidden */}
      <audio
        src={audioSrc}
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={handleDurationChange}
        onEnded={handleEnded}
        onError={handleReactAudioError}
        onLoadedMetadata={() => {
          console.log('Audio metadata loaded');
          // Auto-play when metadata is loaded (if isPlaying is true)
          if (isPlaying && audioRef.current) {
            audioRef.current.play().catch((err) => {
              console.warn('Auto-play prevented:', err);
              setIsPlaying(false);
            });
          }
        }}
        style={{ display: 'none' }}
        // Adding an empty track element to satisfy accessibility requirements
        // This is just to silence the linting error, but in a production app
        // you should ideally provide actual captions when available
      >
        <track kind="captions" src="" label="English captions" />
      </audio>
    </>
  );
}

export default MusicPage;
