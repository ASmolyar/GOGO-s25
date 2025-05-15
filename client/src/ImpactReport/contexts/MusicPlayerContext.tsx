import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
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
  console.log('MusicPlayerProvider initializing');
  // State for the music player
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7); // Default volume
  const [modalState, setModalState] = useState<
    'full' | 'pip' | 'minimized' | 'hidden'
  >('pip'); // Default to picture-in-picture mode instead of hidden

  console.log('MusicPlayerProvider initial state:', { modalState, isPlaying });

  // Reference to the audio element
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize the audio element on component mount
  useEffect(() => {
    console.log('MusicPlayerContext: Setting up audio element');
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
      console.log('MusicPlayerContext: Cleaning up audio element');
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
  const setModalStateWithLogging = (
    state: 'full' | 'pip' | 'minimized' | 'hidden',
  ) => {
    console.log(`Modal state changing: ${modalState} -> ${state}`);
    setModalState(state);
  };

  // Update audio src when currentSong changes
  useEffect(() => {
    console.log('currentSong changed effect running');
    if (audioRef.current && currentSong) {
      audioRef.current.src = currentSong.audio_file;

      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
        });
      }
    }
  }, [currentSong]);

  // Track modal state changes
  useEffect(() => {
    console.log('Modal state updated to:', modalState);
  }, [modalState]);

  // The context value
  const contextValue: MusicPlayerContextType = {
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
  };

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
    console.error('useMusicPlayer was called outside of MusicPlayerProvider');
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
};
