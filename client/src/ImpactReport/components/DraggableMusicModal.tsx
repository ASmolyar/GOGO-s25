import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useMusicPlayer } from '../contexts/MusicPlayerContext';
import COLORS from '../../assets/colors.ts';
import MusicLibrary from './MusicLibrary';
import AlbumView from './AlbumView';
import ArtistView from './ArtistView';
import { animate, createDraggable } from 'animejs';

// Define types
type ModalState = 'full' | 'pip' | 'minimized' | 'hidden';

// Styled components
const ModalContainer = styled.div<{ viewState: ModalState }>`
  position: fixed;
  background: rgba(18, 18, 18, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  z-index: 9999;
  transition: width 0.5s ease, height 0.5s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  overflow: hidden;

  /* Position based on view state */
  ${(props) =>
    props.viewState === 'full' &&
    `
    top: 0 !important;
    left: 0 !important;
    width: 100vw;
    height: 100vh;
    border-radius: 0;
    transform: none !important;
  `}

  ${(props) =>
    props.viewState === 'pip' &&
    `
    width: 480px;
    height: 320px;
  `}
  
  ${(props) =>
    props.viewState === 'minimized' &&
    `
    height: 40px;
    width: 240px;
  `}
  
  ${(props) =>
    props.viewState === 'hidden' &&
    `
    display: none;
  `}
  
  /* Set default position */
  top: 100px;
  left: 100px;
`;

const ModalHeader = styled.div<{ viewState: ModalState }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${(props) =>
    props.viewState === 'minimized' ? '0 15px' : '10px 20px'};
  background: rgba(0, 0, 0, 0.5);
  cursor: grab;
  height: ${(props) => (props.viewState === 'minimized' ? '100%' : '60px')};
  border-bottom: 2px solid ${COLORS.gogo_blue};
  position: relative;

  &:after {
    content: 'Drag here';
    position: absolute;
    right: 120px;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  &:active {
    cursor: grabbing;
  }
`;

const HeaderTitle = styled.div`
  font-weight: bold;
  font-size: 16px;
  color: white;
  display: flex;
  align-items: center;

  svg {
    margin-right: 8px;
  }
`;

const HeaderControls = styled.div`
  display: flex;
  gap: 16px;
`;

const ControlButton = styled.button`
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
  width: 24px;
  height: 24px;
  border-radius: 50%;

  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ModalContent = styled.div<{ viewState: ModalState }>`
  ${(props) =>
    props.viewState === 'minimized' &&
    `
    display: none;
  `}

  height: calc(100% - 60px);
  overflow-y: auto;
  padding: ${(props) => (props.viewState === 'full' ? '20px' : '10px')};
`;

const ModeSelector = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
`;

const ModeButton = styled.button<{ active: boolean }>`
  background: ${(props) => (props.active ? COLORS.gogo_blue : 'transparent')};
  border: 1px solid
    ${(props) => (props.active ? COLORS.gogo_blue : 'rgba(255, 255, 255, 0.2)')};
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) =>
      props.active ? COLORS.gogo_blue : 'rgba(255, 255, 255, 0.1)'};
  }
`;

const DragHandle = styled.div`
  width: 40px;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  margin: 0 auto;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 5px;
`;

const NowPlayingInfo = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  overflow: hidden;
  flex: 1;
`;

const MiniAlbumArt = styled.div<{ src: string }>`
  width: 24px;
  height: 24px;
  min-width: 24px;
  background-image: ${({ src }) => `url(${src})`};
  background-size: cover;
  background-position: center;
  margin-right: 10px;
  border-radius: 2px;
`;

const MiniTrackInfo = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  font-size: 13px;
`;

// Icon components
const ExpandIcon = () => (
  <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M6.064 10.229l-2.418 2.418L2 11v4h4l-1.647-1.646 2.418-2.418-.707-.707zM11 2l1.647 1.647-2.418 2.418.707.707 2.418-2.418L15 6V2h-4z" />
  </svg>
);

const MinimizeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M14 8a1 1 0 01-1 1H3a1 1 0 010-2h10a1 1 0 011 1z" />
  </svg>
);

// Outward facing arrows for expanding
const FullscreenIcon = () => (
  <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M6.064 10.229l-2.418 2.418L2 11v4h4l-1.647-1.646 2.418-2.418-.707-.707zM11 2l1.647 1.647-2.418 2.418.707.707 2.418-2.418L15 6V2h-4z" />
  </svg>
);

// Inward facing arrows for minimizing from fullscreen
const CompressIcon = () => (
  <svg height="16" width="16" viewBox="0 0 512 512" fill="currentColor">
    <path
      d="M213.333,42.667C201.551,42.667,192,52.218,192,64v97.83L36.418,6.248c-8.331-8.331-21.839-8.331-30.17,0
      c-8.331,8.331-8.331,21.839,0,30.17L161.83,192H64c-11.782,0-21.333,9.551-21.333,21.333c0,11.782,9.551,21.333,21.333,21.333
      h149.333c0.007,0,0.014-0.001,0.021-0.001c0.696-0.001,1.391-0.037,2.084-0.105c0.318-0.031,0.627-0.091,0.94-0.136
      c0.375-0.054,0.75-0.098,1.122-0.171c0.359-0.071,0.708-0.17,1.061-0.259c0.322-0.081,0.645-0.151,0.964-0.248
      c0.346-0.105,0.68-0.234,1.018-0.356c0.318-0.114,0.639-0.219,0.953-0.349c0.316-0.131,0.618-0.284,0.926-0.43
      c0.323-0.152,0.649-0.296,0.966-0.465c0.295-0.158,0.575-0.338,0.861-0.509c0.311-0.186,0.626-0.361,0.929-0.564
      c0.316-0.211,0.613-0.447,0.917-0.674c0.253-0.19,0.513-0.365,0.759-0.568c1.087-0.892,2.085-1.889,2.977-2.977
      c0.202-0.246,0.378-0.506,0.568-0.759c0.228-0.304,0.463-0.601,0.674-0.917c0.203-0.303,0.379-0.618,0.564-0.929
      c0.171-0.286,0.351-0.566,0.509-0.861c0.169-0.317,0.313-0.643,0.465-0.966c0.145-0.308,0.299-0.611,0.43-0.926
      c0.13-0.314,0.235-0.635,0.349-0.953c0.122-0.338,0.251-0.672,0.356-1.018c0.096-0.318,0.167-0.642,0.248-0.964
      c0.089-0.353,0.188-0.701,0.259-1.061c0.074-0.372,0.118-0.748,0.171-1.122c0.045-0.314,0.104-0.622,0.136-0.94
      c0.069-0.7,0.106-1.402,0.106-2.105V64C234.667,52.218,225.115,42.667,213.333,42.667z"
    />
    <path
      d="M505.752,475.582L350.17,320H448c11.782,0,21.333-9.551,21.333-21.333c0-11.782-9.551-21.333-21.333-21.333H298.667
      c-0.703,0-1.405,0.037-2.105,0.106c-0.318,0.031-0.627,0.091-0.94,0.136c-0.375,0.054-0.75,0.098-1.122,0.171
      c-0.359,0.071-0.708,0.17-1.061,0.259c-0.322,0.081-0.645,0.151-0.964,0.248c-0.346,0.105-0.68,0.234-1.018,0.356
      c-0.318,0.114-0.639,0.219-0.953,0.349c-0.316,0.131-0.618,0.284-0.926,0.43c-0.323,0.152-0.649,0.296-0.966,0.465
      c-0.295,0.158-0.575,0.338-0.861,0.509c-0.311,0.186-0.626,0.361-0.929,0.564c-0.316,0.211-0.613,0.447-0.917,0.674
      c-0.253,0.19-0.513,0.365-0.759,0.568c-1.087,0.892-2.085,1.889-2.977,2.977c-0.202,0.246-0.378,0.506-0.568,0.759
      c-0.228,0.304-0.463,0.601-0.674,0.917c-0.203,0.303-0.379,0.618-0.564,0.929c-0.171,0.286-0.351,0.566-0.509,0.861
      c-0.169,0.317-0.313,0.643-0.465,0.966c-0.145,0.308-0.299,0.611-0.43,0.926c-0.13,0.314-0.235,0.635-0.349,0.953
      c-0.122,0.338-0.251,0.672-0.356,1.018c-0.096,0.318-0.167,0.642-0.248,0.964c-0.089,0.353-0.188,0.701-0.259,1.061
      c-0.074,0.372-0.118,0.748-0.171,1.122c-0.045,0.314-0.104,0.622-0.136,0.94c-0.068,0.693-0.105,1.388-0.105,2.084
      c0,0.007-0.001,0.014-0.001,0.021V448c0,11.782,9.551,21.333,21.333,21.333c11.782,0,21.333-9.551,21.333-21.333v-97.83
      l155.582,155.582c8.331,8.331,21.839,8.331,30.17,0C514.083,497.42,514.083,483.913,505.752,475.582z"
    />
  </svg>
);

const PictureInPictureIcon = () => (
  <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M6.064 10.229l-2.418 2.418L2 11v4h4l-1.647-1.646 2.418-2.418-.707-.707zM11 2l1.647 1.647-2.418 2.418.707.707 2.418-2.418L15 6V2h-4z" />
  </svg>
);

const MusicNoteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M14 0h-1.3c-.3 0-.6.2-.7.5l-1.9 7.4c-.1.5-.6.8-1 .6-1-.6-2.4-.1-3.2 1-.6.9-.8 2.2-.2 2.9.5.7 1.6.9 2.7.6 1.2-.3 2.3-1.3 2.8-2.5.1-.3.2-.5.2-.8V2.9l1.9-.5-.1 10.3c-.1.5-.6.9-1 .6-1-.6-2.4-.1-3.2 1-.6.9-.8 2.2-.2 2.9.5.7 1.6.9 2.7.6 1.2-.3 2.3-1.3 2.8-2.5.1-.3.2-.5.2-.8V.5c0-.3-.2-.5-.5-.5z" />
  </svg>
);

// Main component
const DraggableMusicModal: React.FC = () => {
  const {
    currentSong,
    currentAlbum,
    isPlaying,
    modalState,
    setModalState,
    playSong,
  } = useMusicPlayer();

  // Component state
  const [mode, setMode] = useState<'library' | 'album' | 'artist'>('library');
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);

  // Use a ref to track if this is the first render
  const isFirstRender = useRef(true);

  // Position tracking
  const [previousPosition, setPreviousPosition] = useState({ x: 100, y: 100 });

  // Track draggable instance
  const draggableInstance = useRef<any>(null);

  // Create refs
  const modalRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Make the modal start in fullscreen mode
  useEffect(() => {
    // Only run on first render
    if (
      isFirstRender.current &&
      modalState !== 'hidden' &&
      modalState !== 'full'
    ) {
      setModalState('full');
      isFirstRender.current = false;
    }
  }, [modalState, setModalState]);

  // Define a type guard to check if modalState is 'full'
  const isFullScreen = (state: ModalState): state is 'full' => state === 'full';

  // Set up AnimeJS draggable
  useEffect(() => {
    if (!modalRef.current || !headerRef.current) return;

    // Initialize draggable if it doesn't exist
    if (!draggableInstance.current) {
      // Use only documented properties that we know exist in the API
      draggableInstance.current = createDraggable(modalRef.current, {
        trigger: headerRef.current,
        // Use container to keep the modal within viewport bounds
        container: () => [
          0,
          window.innerWidth - (modalRef.current?.offsetWidth || 0),
          window.innerHeight - (modalRef.current?.offsetHeight || 0) - 90,
          0,
        ],
      });
    }

    // Enable or disable dragging based on modal state
    if (draggableInstance.current) {
      // Only disable dragging in fullscreen mode
      // For both minimized and pip, dragging should be enabled
      if (isFullScreen(modalState)) {
        draggableInstance.current.disable();
      } else {
        draggableInstance.current.enable();
      }

      // Refresh the draggable when switching between modes, especially to/from minimized
      draggableInstance.current.refresh();
    }

    // Cleanup function
    return () => {
      if (draggableInstance.current) {
        draggableInstance.current = null;
      }
    };
  }, [modalState]);

  // Restore position when switching from full to pip or minimized,
  // or when switching between pip and minimized
  useEffect(() => {
    if (
      !isFullScreen(modalState) &&
      modalRef.current &&
      draggableInstance.current
    ) {
      // Use a small timeout to ensure the state has been updated
      setTimeout(() => {
        if (draggableInstance.current) {
          // Use the proper API methods to set position
          draggableInstance.current.setX(previousPosition.x);
          draggableInstance.current.setY(previousPosition.y);

          // Refresh the draggable to ensure constraints are properly applied
          draggableInstance.current.refresh();
        }
      }, 50);
    }
  }, [modalState, previousPosition]);

  // Change view state handlers
  const handleMinimize = () => {
    // Store current position before minimizing
    if (modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      setPreviousPosition({
        x: rect.left,
        y: rect.top,
      });
    }

    setModalState('minimized');
  };

  const handleMaximize = () => {
    // Store current position before going fullscreen
    if (modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      setPreviousPosition({
        x: rect.left,
        y: rect.top,
      });
    }

    setModalState('full');
  };

  const handlePipMode = () => {
    // Store current position before changing to pip mode
    if (modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      setPreviousPosition({
        x: rect.left,
        y: rect.top,
      });
    }

    setModalState('pip');
  };

  // Handle content navigation
  const handleAlbumClick = (albumId: string) => {
    setSelectedAlbumId(albumId);
    setMode('album');
  };

  const handleArtistClick = (artistId: string) => {
    setSelectedArtistId(artistId);
    setMode('artist');
  };

  const handleLibraryClick = () => {
    setMode('library');
    setSelectedAlbumId(null);
    setSelectedArtistId(null);
  };

  // Handle play track from any view
  const handlePlayTrack = (song: any, album: any) => {
    playSong(song, album);
  };

  // Helper to get header title based on mode
  const getHeaderTitle = () => {
    if (modalState === 'minimized') {
      return (
        <NowPlayingInfo>
          {currentSong && currentAlbum && (
            <>
              <MiniAlbumArt
                src={currentAlbum.cover || '/music/default-album.jpg'}
              />
              <MiniTrackInfo>
                {currentSong.title} - {currentSong.artists[0]?.name}
              </MiniTrackInfo>
            </>
          )}
          {!currentSong && <span>GOGO Music</span>}
        </NowPlayingInfo>
      );
    }

    switch (mode) {
      case 'album':
        return 'Album View';
      case 'artist':
        return 'Artist View';
      default:
        return (
          <HeaderTitle>
            <MusicNoteIcon /> GOGO Music Library
          </HeaderTitle>
        );
    }
  };

  // Get content based on current mode
  const getContent = () => {
    switch (mode) {
      case 'album':
        return selectedAlbumId ? (
          <AlbumView
            albumId={selectedAlbumId}
            onPlayTrack={handlePlayTrack}
            onBackClick={handleLibraryClick}
            currentlyPlayingId={currentSong?.song_id || null}
            isPlaying={isPlaying}
          />
        ) : null;

      case 'artist':
        return selectedArtistId ? (
          <ArtistView
            artist={{
              id: selectedArtistId,
              name: 'Loading...',
              image: '',
              monthlyListeners: '',
              description: '',
            }}
            onPlayTrack={handlePlayTrack}
          />
        ) : null;

      default:
        return (
          <MusicLibrary
            onAlbumClick={handleAlbumClick}
            onArtistClick={handleArtistClick}
            onPlayTrack={handlePlayTrack}
            currentlyPlayingId={currentSong?.song_id || null}
            isPlaying={isPlaying}
          />
        );
    }
  };

  if (modalState === 'hidden') {
    return null;
  }

  return (
    <ModalContainer ref={modalRef} viewState={modalState}>
      <ModalHeader ref={headerRef} viewState={modalState}>
        <DragHandle />
        {getHeaderTitle()}

        <HeaderControls>
          {modalState !== 'minimized' && (
            <>
              {modalState === 'full' ? (
                <ControlButton
                  onClick={handlePipMode}
                  aria-label="Picture in Picture"
                >
                  <CompressIcon />
                </ControlButton>
              ) : (
                <ControlButton onClick={handleMaximize} aria-label="Fullscreen">
                  <FullscreenIcon />
                </ControlButton>
              )}
            </>
          )}

          {modalState !== 'minimized' ? (
            <ControlButton onClick={handleMinimize} aria-label="Minimize">
              <MinimizeIcon />
            </ControlButton>
          ) : (
            <ControlButton onClick={handlePipMode} aria-label="Expand">
              <FullscreenIcon />
            </ControlButton>
          )}
        </HeaderControls>
      </ModalHeader>

      <ModalContent viewState={modalState}>
        {modalState !== 'minimized' && (
          <>
            <ModeSelector>
              <ModeButton
                active={mode === 'library'}
                onClick={handleLibraryClick}
              >
                Library
              </ModeButton>
              {selectedAlbumId && (
                <ModeButton
                  active={mode === 'album'}
                  onClick={() => setMode('album')}
                >
                  Album
                </ModeButton>
              )}
              {selectedArtistId && (
                <ModeButton
                  active={mode === 'artist'}
                  onClick={() => setMode('artist')}
                >
                  Artist
                </ModeButton>
              )}
            </ModeSelector>
            {getContent()}
          </>
        )}
      </ModalContent>
    </ModalContainer>
  );
};

export default DraggableMusicModal;
