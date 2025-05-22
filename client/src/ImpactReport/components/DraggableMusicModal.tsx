import React, { useRef, useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { animate, createDraggable } from 'animejs';
import { useMusicPlayer } from '../contexts/MusicPlayerContext';
import COLORS from '../../assets/colors.ts';
import MusicLibrary from './MusicLibrary';
import AlbumView from './AlbumView';

// Define types
type ModalState = 'full' | 'pip' | 'minimized' | 'hidden';
type ViewMode = 'library' | 'album';

// Define types for anime.js draggable
interface DraggableInstance {
  // Remove the properties that might not exist on the actual instance
  enable?: () => void;
  disable?: () => void;
  refresh: () => void;
  // These might not exist, so make them optional
  setX?: (value: number) => void;
  setY?: (value: number) => void;
  // The actual returned type from createDraggable
  [key: string]: any;
}

// Styled components
const ModalContainer = styled.div<{ $viewState: ModalState }>`
  position: fixed;
  background: rgba(18, 18, 18, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  z-index: 9999;
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  overflow: hidden;

  /* Position based on view state */
  ${(props) =>
    props.$viewState === 'full' &&
    `
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    border-radius: 0;
    transform: none !important;
  `}

  ${(props) =>
    props.$viewState === 'pip' &&
    `
    width: 600px;
    height: 450px;
  `}
  
  ${(props) =>
    props.$viewState === 'minimized' &&
    `
    height: 40px;
    width: 240px;
    bottom: 70px !important;
    right: 20px !important;
    left: auto !important;
    top: auto !important;
    position: fixed;
  `}
  
  ${(props) =>
    props.$viewState === 'hidden' &&
    `
    display: none;
  `}
`;

const ModalHeader = styled.div<{ $viewState: ModalState }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${(props) =>
    props.$viewState === 'minimized' ? '0 15px' : '10px 20px'};
  background: rgba(0, 0, 0, 0.5);
  cursor: grab;
  height: ${(props) => (props.$viewState === 'minimized' ? '100%' : '60px')};
  border-bottom: 2px solid ${COLORS.gogo_blue};
  position: relative;

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

// Reset button removed as it's not needed

const ModalContent = styled.div<{ $viewState: ModalState }>`
  ${(props) =>
    props.$viewState === 'minimized' &&
    `
    display: none;
  `}

  height: calc(100% - 60px);
  overflow-y: auto;
  padding: ${(props) => (props.$viewState === 'full' ? '20px' : '10px')};
  overscroll-behavior: contain; /* Prevent scroll chaining */

  /* Custom scrollbar */
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    border: none;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
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
function ExpandIcon() {
  return (
    <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M6.064 10.229l-2.418 2.418L2 11v4h4l-1.647-1.646 2.418-2.418-.707-.707zM11 2l1.647 1.647-2.418 2.418.707.707 2.418-2.418L15 6V2h-4z" />
    </svg>
  );
}

function MinimizeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M14 8a1 1 0 01-1 1H3a1 1 0 010-2h10a1 1 0 011 1z" />
    </svg>
  );
}

// Outward facing arrows for expanding
function FullscreenIcon() {
  return (
    <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M6.064 10.229l-2.418 2.418L2 11v4h4l-1.647-1.646 2.418-2.418-.707-.707zM11 2l1.647 1.647-2.418 2.418.707.707 2.418-2.418L15 6V2h-4z" />
    </svg>
  );
}

// Inward facing arrows for minimizing from fullscreen
function CompressIcon() {
  return (
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
}

function PictureInPictureIcon() {
  return (
    <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M6.064 10.229l-2.418 2.418L2 11v4h4l-1.647-1.646 2.418-2.418-.707-.707zM11 2l1.647 1.647-2.418 2.418.707.707 2.418-2.418L15 6V2h-4z" />
    </svg>
  );
}

function MusicNoteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M14 0h-1.3c-.3 0-.6.2-.7.5l-1.9 7.4c-.1.5-.6.8-1 .6-1-.6-2.4-.1-3.2 1-.6.9-.8 2.2-.2 2.9.5.7 1.6.9 2.7.6 1.2-.3 2.3-1.3 2.8-2.5.1-.3.2-.5.2-.8V2.9l1.9-.5-.1 10.3c-.1.5-.6.9-1 .6-1-.6-2.4-.1-3.2 1-.6.9-.8 2.2-.2 2.9.5.7 1.6.9 2.7.6 1.2-.3 2.3-1.3 2.8-2.5.1-.3.2-.5.2-.8V.5c0-.3-.2-.5-.5-.5z" />
    </svg>
  );
}

// Main component
function DraggableMusicModal() {
  const {
    currentSong,
    currentAlbum,
    isPlaying,
    modalState,
    setModalState,
    playSong,
  } = useMusicPlayer();

  // Component state
  const [mode, setMode] = useState<ViewMode>('library');
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);

  // Use a ref to track if this is the first render
  const isFirstRender = useRef(true);

  // Use ref to track previous modal state for position restoration
  const previousModalState = useRef<ModalState>(modalState);

  // Track local modal state to debug issues
  const [localModalState, setLocalModalState] =
    useState<ModalState>(modalState);

  // Update local state when context state changes
  useEffect(() => {
    console.log('[Debug] modalState updated from context:', modalState);
    setLocalModalState(modalState);
  }, [modalState]);

  // Track draggable instance
  const draggableInstance = useRef<DraggableInstance | null>(null);

  // Create refs
  const modalRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const minimizeButtonRef = useRef<HTMLButtonElement>(null);

  // Track if there was a failed drag attempt
  // We don't need to track drag issues separately

  // Define the bottom right position function
  const getBottomRightPosition = useCallback(() => {
    const rightPos = Math.max(window.innerWidth - 650, 20);
    const bottomPos = Math.max(window.innerHeight - 500, 20);
    return { x: rightPos, y: bottomPos };
  }, []);

  // Helper to reinitialize draggable
  const reinitializeDraggable = useCallback(() => {
    console.log('[Draggable] Reinitializing draggable instance');
    if (draggableInstance.current) {
      try {
        // Try to disable first
        if (typeof draggableInstance.current.disable === 'function') {
          draggableInstance.current.disable();
        }
        draggableInstance.current = null;
      } catch (error) {
        console.error('[Draggable] Error disabling old instance:', error);
      }
    }

    try {
      if (modalRef.current && headerRef.current) {
        // Position at bottom right
        const position = getBottomRightPosition();
        modalRef.current.style.left = `${position.x}px`;
        modalRef.current.style.top = `${position.y}px`;
        modalRef.current.style.right = 'auto';
        modalRef.current.style.bottom = 'auto';

        // Allow the modal to be dragged across the entire screen
        // Calculate the actual available space for dragging
        const maxX = window.innerWidth - modalRef.current.offsetWidth;
        const maxY = window.innerHeight - modalRef.current.offsetHeight;

        console.log('[Draggable] Available drag area:', { maxX, maxY });

        // Create the draggable instance with container boundaries set to window size
        // This prevents the modal from going off-screen
        draggableInstance.current = createDraggable(modalRef.current, {
          trigger: headerRef.current,
          container: document.body, // Use document.body as the container to restrict to viewport
        });

        console.log('[Draggable] New draggable instance created');
      }
    } catch (error) {
      console.error('[Draggable] Error creating draggable instance:', error);
      console.error(
        '[Draggable] Error details:',
        error instanceof Error ? error.message : error,
      );
    }
  }, [getBottomRightPosition, modalRef, headerRef]);

  // Only prevent main page scrolling when in fullscreen mode, while allowing scrolling inside the modal
  useEffect(() => {
    if (modalState === 'full') {
      // Just use a simple approach to prevent background scrolling
      // This allows scrolling inside the modal content but prevents page scrolling
      document.body.style.overflow = 'hidden';

      // Make sure the modal content itself is scrollable
      if (modalRef.current) {
        const modalContent = modalRef.current.querySelector(
          '[data-modal-content]',
        );
        if (modalContent) {
          (modalContent as HTMLElement).style.overflowY = 'auto';
        }
      }

      return () => {
        // Re-enable scrolling when fullscreen mode ends
        document.body.style.overflow = '';
      };
    } else {
      // Ensure scrolling is enabled when not in fullscreen
      document.body.style.overflow = '';
    }
  }, [modalState, modalRef]);

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

  // Force a redraw of the modal when switching to fullscreen
  useEffect(() => {
    if (modalState === 'full' && modalRef.current) {
      // Force reflow
      modalRef.current.style.display = 'none';
      // Trigger reflow without using void
      const height = modalRef.current.offsetHeight;
      modalRef.current.style.display = '';
    }
  }, [modalState]);

  // Initialize draggable for pip mode only (not minimized)
  useEffect(() => {
    // Only set up draggable for pip mode, not minimized
    if (modalState === 'pip' && modalRef.current) {
      // Wait for the state transition animation to complete
      setTimeout(() => {
        console.log(`[Draggable] Initializing draggable in ${modalState} mode`);

        // Position the modal in the bottom right
        const position = getBottomRightPosition();
        if (modalRef.current) {
          modalRef.current.style.left = `${position.x}px`;
          modalRef.current.style.top = `${position.y}px`;
          modalRef.current.style.right = 'auto';
          modalRef.current.style.bottom = 'auto';
        }

        if (!draggableInstance.current) {
          reinitializeDraggable();
        } else {
          // Refresh the existing instance
          try {
            draggableInstance.current.refresh();
          } catch (error) {
            console.error('[Draggable] Error refreshing instance:', error);
            reinitializeDraggable();
          }
        }
      }, 200);
    } else if (modalState === 'minimized' && draggableInstance.current) {
      // Disable dragging when minimized
      if (typeof draggableInstance.current.disable === 'function') {
        draggableInstance.current.disable();
        console.log('[Draggable] Disabled dragging for minimized state');
      }
    }
  }, [modalState, modalRef, reinitializeDraggable, getBottomRightPosition]);

  // Modify the window resize handler to only reposition the pip mode, not minimized
  useEffect(() => {
    const handleResize = () => {
      if (modalState === 'pip' && modalRef.current) {
        // Check if the modal is outside the visible area after resize
        const rect = modalRef.current.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width;
        const maxY = window.innerHeight - rect.height;

        // If the modal is outside the visible area, reposition it
        let repositioned = false;
        if (rect.right > window.innerWidth || rect.left < 0) {
          modalRef.current.style.left = `${Math.min(
            Math.max(0, rect.left),
            maxX,
          )}px`;
          repositioned = true;
        }

        if (rect.bottom > window.innerHeight || rect.top < 0) {
          modalRef.current.style.top = `${Math.min(
            Math.max(0, rect.top),
            maxY,
          )}px`;
          repositioned = true;
        }

        // If repositioned, log it
        if (repositioned) {
          console.log('[Window] Modal repositioned after resize');
        }

        // Always recreate the draggable instance after resize to update container boundaries
        try {
          // First disable the old instance if it exists
          if (
            draggableInstance.current &&
            typeof draggableInstance.current.disable === 'function'
          ) {
            draggableInstance.current.disable();
          }

          // Create a new draggable instance with updated boundaries
          if (modalRef.current && headerRef.current) {
            draggableInstance.current = createDraggable(modalRef.current, {
              trigger: headerRef.current,
              container: document.body, // Use document.body as container to restrict to viewport
            });
            console.log(
              '[Window] Draggable recreated with new boundaries after resize',
            );
          }
        } catch (error) {
          console.error(
            '[Draggable] Error recreating draggable instance on resize:',
            error,
          );
          reinitializeDraggable();
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [modalState, modalRef, reinitializeDraggable]);

  // Change view state handlers
  const handleMinimize = useCallback(() => {
    console.log('[State] Minimizing from', modalState);

    // If we're in fullscreen mode, transition to pip mode
    if (modalState === 'full') {
      console.log('[State] Transitioning from fullscreen to pip');

      // From fullscreen, we only go to pip (not directly to minimized)
      setModalState('pip');
    }
    // If we're in pip mode, go to minimized
    else if (modalState === 'pip') {
      console.log('[State] Transitioning from pip to minimized');

      // Disable dragging before minimizing
      if (
        draggableInstance.current &&
        typeof draggableInstance.current.disable === 'function'
      ) {
        draggableInstance.current.disable();
      }

      setModalState('minimized');
    }
    // Toggle between minimized and pip
    else if (modalState === 'minimized') {
      console.log('[State] Transitioning from minimized to pip');
      setModalState('pip');

      // Need to reapply position after modal state change to pip
      setTimeout(() => {
        if (modalRef.current) {
          // Position in center of the screen for better visibility
          const x = Math.max(0, (window.innerWidth - 600) / 2); // PiP width is 600px
          const y = Math.max(0, (window.innerHeight - 450) / 3); // PiP height is 450px, position in upper third

          // Apply position
          modalRef.current.style.left = `${x}px`;
          modalRef.current.style.top = `${y}px`;
          modalRef.current.style.right = 'auto';
          modalRef.current.style.bottom = 'auto';

          // Reinitialize draggable for the new size
          setTimeout(reinitializeDraggable, 50);
        }
      }, 50);
    }
  }, [modalState, setModalState, modalRef, reinitializeDraggable]);

  const handleMaximize = useCallback(() => {
    console.log('[State] Maximizing from', modalState);
    // Store current position before going fullscreen
    if (modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      const newPosition = {
        x: rect.left,
        y: rect.top,
      };
      console.log('[Position] Storing position before maximize:', newPosition);
    }

    setModalState('full');
  }, [modalState, setModalState, modalRef]);

  const handlePipMode = useCallback(() => {
    console.log(
      '[DIRECT ACTION] Explicitly transitioning from fullscreen to pip mode',
    );

    // Force modalState update
    setModalState('pip');

    // Force a direct state change with no animation
    if (modalRef.current) {
      console.log('[UI] Force removing fullscreen styles');
      // Cancel fullscreen styling immediately

      // Calculate a position that ensures the modal is fully visible on screen
      // Center horizontally, but keep it in the upper part of the screen
      const modalWidth = 600; // Modal width is 600px
      const modalHeight = 450; // Modal height is 450px

      // Keep modal within viewport bounds
      const maxX = Math.max(0, window.innerWidth - modalWidth);
      const maxY = Math.max(0, window.innerHeight - modalHeight);

      // Start with center position
      const x = Math.min(
        Math.max(0, (window.innerWidth - modalWidth) / 2),
        maxX,
      );
      const y = Math.min(
        Math.max(0, (window.innerHeight - modalHeight) / 3),
        maxY,
      ); // Position in upper third

      // Apply styles immediately
      modalRef.current.style.width = `${modalWidth}px`;
      modalRef.current.style.height = `${modalHeight}px`;
      modalRef.current.style.top = `${y}px`;
      modalRef.current.style.left = `${x}px`;
      modalRef.current.style.bottom = 'auto';
      modalRef.current.style.right = 'auto';
      modalRef.current.style.transition = 'none';

      // Force a reflow to ensure the styles are applied immediately
      void modalRef.current.offsetHeight;

      // Now reset the transition back
      setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.style.transition = '';
        }
      }, 50);

      // Re-initialize draggable after transition
      setTimeout(() => {
        reinitializeDraggable();
      }, 200);
    }
  }, [setModalState, reinitializeDraggable, modalRef]);

  // Fix useEffect with refs
  useEffect(() => {
    // Store the ref value in a variable
    const headerElement = headerRef.current;

    const handleHeaderButtonClick = (e: MouseEvent) => {
      if (!(e.target instanceof Element)) {
        return;
      }

      const button = e.target.closest('button');
      if (!button) {
        return;
      }

      const ariaLabel = button.getAttribute('aria-label');
      if (!ariaLabel) {
        return;
      }

      // Log the button click
      console.log(
        '[Direct] Button click detected:',
        ariaLabel,
        'in state:',
        modalState,
      );

      // Handle each button type
      if (ariaLabel === 'Picture in Picture' && modalState === 'full') {
        console.log('[Direct] PiP button click handler triggered');
        setModalState('pip');
      } else if (ariaLabel === 'Fullscreen' && modalState === 'pip') {
        console.log('[Direct] Fullscreen button click handler triggered');
        handleMaximize();
      } else if (ariaLabel === 'Minimize' && modalState === 'pip') {
        console.log('[Direct] Minimize button click handler triggered');
        handleMinimize();
      } else if (ariaLabel === 'Expand' && modalState === 'minimized') {
        console.log('[Direct] Expand button click handler triggered');
        handlePipMode();
      }

      return undefined;
    };

    // Add the event listener to the header
    if (headerElement) {
      headerElement.addEventListener(
        'click',
        handleHeaderButtonClick as EventListener,
      );
    }

    return () => {
      if (headerElement) {
        headerElement.removeEventListener(
          'click',
          handleHeaderButtonClick as EventListener,
        );
      }
    };
  }, [
    modalState,
    handleMinimize,
    handleMaximize,
    handlePipMode,
    setModalState,
  ]);

  // Add a direct event listener to the minimize button
  useEffect(() => {
    const handleMinimizeClick = (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      console.log('[Direct] Minimize button clicked in', modalState);
      handleMinimize();
    };

    if (minimizeButtonRef.current && modalState === 'pip') {
      console.log(
        '[Setup] Adding direct click handler to minimize button in pip mode',
      );
      const button = minimizeButtonRef.current;
      // Remove any existing listeners first
      button.removeEventListener('click', handleMinimizeClick as EventListener);
      // Add the new listener
      button.addEventListener('click', handleMinimizeClick as EventListener);

      return () => {
        button.removeEventListener(
          'click',
          handleMinimizeClick as EventListener,
        );
      };
    }
  }, [modalState, handleMinimize]);

  // Handle content navigation
  const handleAlbumClick = (albumId: string) => {
    setSelectedAlbumId(albumId);
    setMode('album');
  };

  const handleLibraryClick = () => {
    setMode('library');
    setSelectedAlbumId(null);
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
            modalState={modalState}
          />
        ) : null;

      default:
        return (
          <MusicLibrary
            onAlbumClick={handleAlbumClick}
            onPlayTrack={handlePlayTrack}
            currentlyPlayingId={currentSong?.song_id || null}
            isPlaying={isPlaying}
            modalState={modalState}
          />
        );
    }
  };

  if (modalState === 'hidden') {
    return null;
  }

  return (
    <ModalContainer ref={modalRef} $viewState={modalState}>
      <ModalHeader ref={headerRef} $viewState={modalState}>
        <DragHandle />
        {getHeaderTitle()}

        <HeaderControls>
          {/* Show fullscreen/pip toggle only when not minimized */}
          {modalState !== 'minimized' && (
            <>
              {modalState === 'full' ? (
                <ControlButton
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    console.log(
                      '[UI] PiP button clicked directly in fullscreen, current state:',
                      modalState,
                    );

                    // Force a direct state change with no animation
                    if (modalRef.current) {
                      console.log('[UI] Force removing fullscreen styles');
                      // Cancel fullscreen styling immediately

                      // Position in the center of the screen
                      const centerX = (window.innerWidth - 600) / 2; // Modal width is 600px
                      const centerY = (window.innerHeight - 450) / 2; // Modal height is 450px

                      modalRef.current.style.width = '600px';
                      modalRef.current.style.height = '450px';
                      modalRef.current.style.top = `${centerY}px`;
                      modalRef.current.style.left = `${centerX}px`;
                      modalRef.current.style.bottom = 'auto';
                      modalRef.current.style.right = 'auto';
                      modalRef.current.style.borderRadius = '8px';
                    }

                    // Use direct context change
                    setModalState('pip');

                    // Call normal handler as well
                    setTimeout(() => {
                      console.log('[UI] Calling handlePipMode after timeout');
                      handlePipMode();
                    }, 50);
                  }}
                  aria-label="Picture in Picture"
                  title="Enter Picture in Picture mode"
                >
                  <PictureInPictureIcon />
                </ControlButton>
              ) : (
                <ControlButton
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleMaximize();
                  }}
                  aria-label="Fullscreen"
                  title="Enter Fullscreen mode"
                >
                  <FullscreenIcon />
                </ControlButton>
              )}

              {/* Always show minimize/expand depending on state */}
              {modalState === 'pip' ? (
                <ControlButton
                  ref={minimizeButtonRef}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    console.log('[UI] Minimize button clicked');
                    handleMinimize();
                  }}
                  aria-label="Minimize"
                  title="Minimize player"
                >
                  <MinimizeIcon />
                </ControlButton>
              ) : null}
            </>
          )}
          {/* Controls based on modal state */}
          {modalState === 'minimized' && (
            <ControlButton
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handlePipMode();
              }}
              aria-label="Expand"
              title="Expand player to PiP mode"
            >
              <ExpandIcon />
            </ControlButton>
          )}
        </HeaderControls>
      </ModalHeader>

      <ModalContent $viewState={modalState} data-modal-content>
        {modalState !== 'minimized' && (
          <>
            {/* Only show mode selector in full mode, not in pip mode */}
            {modalState === 'full' && (
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
              </ModeSelector>
            )}

            {/* Pass modalState to child components so they can adapt their UI */}
            {mode === 'album' && selectedAlbumId ? (
              <AlbumView
                albumId={selectedAlbumId}
                onPlayTrack={handlePlayTrack}
                onBackClick={handleLibraryClick}
                currentlyPlayingId={currentSong?.song_id || null}
                isPlaying={isPlaying}
                modalState={modalState}
              />
            ) : (
              <MusicLibrary
                onAlbumClick={handleAlbumClick}
                onPlayTrack={handlePlayTrack}
                currentlyPlayingId={currentSong?.song_id || null}
                isPlaying={isPlaying}
                modalState={modalState}
              />
            )}
          </>
        )}
      </ModalContent>
    </ModalContainer>
  );
}

export default DraggableMusicModal;
