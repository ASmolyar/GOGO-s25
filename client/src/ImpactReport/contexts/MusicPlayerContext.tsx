import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { Song, Album } from '../types/music';

// Define the shape of our context
interface MusicPlayerContextType {
  currentSong: Song | null;
  currentAlbum: Album | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  modalState: 'full' | 'pip' | 'minimized' | 'hidden';
  setModalState: (state: 'full' | 'pip' | 'minimized' | 'hidden') => void;
  playSong: (song: Song, album: Album) => void;
  playPause: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
}

// Create the context with a default undefined value
const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(
  undefined,
);

// Provider component that will wrap the app
export const MusicPlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  console.log('[MusicPlayerContext] Provider rendering');
  const renderCountRef = useRef(0);
  const prevPropsRef = useRef<{ children: React.ReactNode }>({ children });

  // Track render count
  useEffect(() => {
    renderCountRef.current += 1;
    console.log(`[MusicPlayerContext] Render count: ${renderCountRef.current}`);
  });

  // Check if this is an unnecessary re-render
  const isRerender =
    React.Children.count(children) ===
    React.Children.count(prevPropsRef.current.children);
  if (isRerender && renderCountRef.current > 1) {
    console.log('[MusicPlayerContext] Detected unnecessary re-render');
  }
  prevPropsRef.current = { children };

  console.log('[MusicPlayerContext] Initializing');

  // State for the music player
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7); // Default volume
  const [modalState, setModalState] = useState<
    'full' | 'pip' | 'minimized' | 'hidden'
  >('full'); // Default to fullscreen mode

  // Track modal state changes
  const prevModalStateRef = useRef<'full' | 'pip' | 'minimized' | 'hidden'>(
    'full',
  );
  const modalStateChangeCountRef = useRef(0);
  const isUpdatingRef = useRef(false);

  console.log('[MusicPlayerContext] Initial state:', { modalState, isPlaying });

  // Reference to the audio element
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize the audio element on component mount
  useEffect(() => {
    console.log('[MusicPlayerContext] Setting up audio element');
    audioRef.current = new Audio();
    const audio = audioRef.current;

    // Set initial volume
    audio.volume = volume;

    // Setup event listeners
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('error', handleAudioError);

    // Clean up function
    return () => {
      console.log('[MusicPlayerContext] Cleaning up audio element');
      audio.pause();
      audio.src = '';
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('error', handleAudioError);
    };
  }, []);

  // Audio event handlers
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleDurationChange = () => {
    if (audioRef.current) {
      console.log('Duration changed:', audioRef.current.duration);
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    console.log('Track ended');
    nextTrack();
  };

  const handleAudioError = (e: Event) => {
    console.error('Audio playback error:', e);
    setIsPlaying(false);
  };

  // Function to play a specific song
  const playSong = (song: Song, album: Album) => {
    console.log('playSong called with:', {
      song: song.title,
      album: album.name,
    });
    setCurrentSong(song);
    setCurrentAlbum(album);

    if (audioRef.current) {
      audioRef.current.src = song.audio_file;
      audioRef.current
        .play()
        .then(() => {
          console.log('Audio started playing successfully');
        })
        .catch((err) => console.error('Error playing audio:', err));
      setIsPlaying(true);
    } else {
      console.error('Audio element not initialized');
    }
  };

  // Function to toggle play/pause
  const playPause = () => {
    console.log('playPause called, current state:', isPlaying);
    if (!audioRef.current || !currentSong) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          console.log('Audio resumed successfully');
        })
        .catch((err) => console.error('Error playing audio:', err));
      setIsPlaying(true);
    }
  };

  // Function to skip to the next track
  const nextTrack = () => {
    console.log('nextTrack called');
    if (!currentAlbum || !currentSong) return;

    const currentIndex = currentAlbum.songs.findIndex(
      (song) => song.song_id === currentSong.song_id,
    );

    if (currentIndex !== -1 && currentIndex < currentAlbum.songs.length - 1) {
      playSong(currentAlbum.songs[currentIndex + 1], currentAlbum);
    } else {
      // We've reached the end of the album, stop playing
      setIsPlaying(false);
    }
  };

  // Function to go back to the previous track
  const previousTrack = () => {
    console.log('previousTrack called');
    if (!currentAlbum || !currentSong) return;

    const currentIndex = currentAlbum.songs.findIndex(
      (song) => song.song_id === currentSong.song_id,
    );

    if (currentIndex > 0) {
      playSong(currentAlbum.songs[currentIndex - 1], currentAlbum);
    }
  };

  // Function to seek to a specific time
  const seek = (time: number) => {
    console.log('seek called:', time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Function to set the volume
  const handleSetVolume = (newVolume: number) => {
    // Convert percentage (0-100) to decimal (0-1)
    const volumeDecimal = newVolume / 100;

    console.log(`Setting volume: ${newVolume}% (${volumeDecimal})`);

    if (audioRef.current) {
      audioRef.current.volume = volumeDecimal;
      setVolume(newVolume);
    }
  };

  // Modal state setter with logging
  const setModalStateWithLogging = useCallback(
    (state: 'full' | 'pip' | 'minimized' | 'hidden') => {
      // Only update if the state is actually different
      if (modalState === state) {
        console.log(
          `[MusicPlayerContext] Skipping identical state update: ${state}`,
        );
        return;
      }

      // Prevent multiple rapid updates
      if (isUpdatingRef.current) {
        console.log(
          `[MusicPlayerContext] Already updating, skipping new state: ${state}`,
        );
        return;
      }

      isUpdatingRef.current = true;

      modalStateChangeCountRef.current += 1;
      console.log(
        `[MusicPlayerContext] Modal state change #${modalStateChangeCountRef.current}: ${modalState} -> ${state}`,
      );

      prevModalStateRef.current = modalState;

      // Add extra debugging to track if state is actually changing
      console.log('[MusicPlayerContext] Previous state object:', {
        modalState,
        isStateEqual: modalState === state,
        stateValue: state,
      });

      // Simply update the state directly without extra logic
      console.log(`[MusicPlayerContext] Calling setModalState(${state})`);
      setModalState(state);

      // Reset the updating flag after a short delay
      setTimeout(() => {
        isUpdatingRef.current = false;
        console.log('[MusicPlayerContext] Reset updating flag');
      }, 200);
    },
    [modalState],
  );

  // Update audio src when currentSong changes
  useEffect(() => {
    console.log('[MusicPlayerContext] currentSong changed effect running');
    if (audioRef.current && currentSong) {
      console.log(
        `[MusicPlayerContext] Updating audio source: ${currentSong.audio_file}`,
      );
      audioRef.current.src = currentSong.audio_file;

      if (isPlaying) {
        console.log('[MusicPlayerContext] Auto-playing after source change');
        audioRef.current.play().catch((error) => {
          console.error('[MusicPlayerContext] Error playing audio:', error);
          setIsPlaying(false);
        });
      }
    }
  }, [currentSong, isPlaying]);

  // Track modal state changes
  useEffect(() => {
    if (prevModalStateRef.current !== modalState) {
      console.log(
        `[MusicPlayerContext] Modal state updated from ${prevModalStateRef.current} to ${modalState}`,
      );
      prevModalStateRef.current = modalState;
    }
  }, [modalState]);

  // The context value
  const contextValue = useMemo(
    () => ({
      currentSong,
      currentAlbum,
      isPlaying,
      currentTime,
      duration,
      volume,
      modalState,
      setModalState: setModalStateWithLogging,
      playSong,
      playPause,
      nextTrack,
      previousTrack,
      seek,
      setVolume: handleSetVolume,
    }),
    [
      currentSong,
      currentAlbum,
      isPlaying,
      currentTime,
      duration,
      volume,
      modalState,
      setModalStateWithLogging,
      playSong,
      playPause,
      nextTrack,
      previousTrack,
      seek,
      handleSetVolume,
    ],
  );

  return (
    <MusicPlayerContext.Provider value={contextValue}>
      {children}
      {/* We can include a hidden audio element here if needed */}
    </MusicPlayerContext.Provider>
  );
};

// Custom hook to use the music player context
export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    console.error(
      '[MusicPlayerContext] useMusicPlayer was called outside of MusicPlayerProvider',
    );
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
};
