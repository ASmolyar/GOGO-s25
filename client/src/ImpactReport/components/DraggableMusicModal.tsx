import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useReducer,
} from 'react';
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
  enable: () => void;
  disable: () => void;
  refresh: () => void;
  setX: (value: number) => void;
  setY: (value: number) => void;
  // The actual returned type from createDraggable
  [key: string]: any;
}

// Define modal state reducer and actions
interface ModalStateData {
  view: ModalState;
  previousView: ModalState | null;
  mode: ViewMode;
  selectedAlbumId: string | null;
  refreshCounter: number;
  hasMinimizedOnce: boolean;
}

type ModalAction =
  | { type: 'ENTER_FULLSCREEN' }
  | { type: 'ENTER_PIP' }
  | { type: 'MINIMIZE' }
  | { type: 'HIDE' }
  | { type: 'SET_MODE'; mode: ViewMode }
  | { type: 'SET_ALBUM'; albumId: string | null }
  | { type: 'REFRESH_CONTENT' }
  | { type: 'FIRST_MINIMIZE' };

// Modal state reducer
function modalReducer(
  state: ModalStateData,
  action: ModalAction,
): ModalStateData {
  switch (action.type) {
    case 'ENTER_FULLSCREEN':
      return {
        ...state,
        view: 'full',
        previousView: state.view,
      };
    case 'ENTER_PIP':
      return {
        ...state,
        view: 'pip',
        previousView: state.view,
      };
    case 'MINIMIZE':
      if (!state.hasMinimizedOnce) {
        return {
          ...state,
          view: 'minimized',
          previousView: state.view,
          refreshCounter: state.refreshCounter + 1,
          hasMinimizedOnce: true,
        };
      }
      return {
        ...state,
        view: 'minimized',
        previousView: state.view,
      };
    case 'HIDE':
      return {
        ...state,
        view: 'hidden',
        previousView: state.view,
      };
    case 'SET_MODE':
      return {
        ...state,
        mode: action.mode,
      };
    case 'SET_ALBUM':
      return {
        ...state,
        selectedAlbumId: action.albumId,
      };
    case 'REFRESH_CONTENT':
      return {
        ...state,
        refreshCounter: state.refreshCounter + 1,
      };
    case 'FIRST_MINIMIZE':
      return {
        ...state,
        view: 'minimized',
        previousView: state.view,
        refreshCounter: state.refreshCounter + 1,
        hasMinimizedOnce: true,
      };
    default:
      return state;
  }
}

// Custom hook for draggable functionality
function useDraggable(
  elementRef: React.RefObject<HTMLElement>,
  triggerRef: React.RefObject<HTMLElement>,
  options: Record<string, any> = {},
) {
  const [isDraggable, setIsDraggable] = useState(false);
  const instanceRef = useRef<DraggableInstance | null>(null);
  const initializationTimer = useRef<number | null>(null);

  const enableDragging = useCallback(() => {
    // Clear any pending initialization
    if (initializationTimer.current) {
      clearTimeout(initializationTimer.current);
    }

    if (instanceRef.current) {
      instanceRef.current.enable();
      console.log('[Draggable] Instance enabled');
    } else {
      setIsDraggable(true);
    }
  }, []);

  const disableDragging = useCallback(() => {
    // Clear any pending initialization
    if (initializationTimer.current) {
      clearTimeout(initializationTimer.current);
    }

    if (instanceRef.current) {
      instanceRef.current.disable();
      console.log('[Draggable] Instance disabled');
    }

    setIsDraggable(false);
  }, []);

  const reinitializeDraggable = useCallback(() => {
    // Clear any pending initialization
    if (initializationTimer.current) {
      clearTimeout(initializationTimer.current);
      initializationTimer.current = null;
    }

    if (!elementRef.current || !triggerRef.current) return;

    // Disable current instance first if it exists
    if (instanceRef.current) {
      instanceRef.current.disable();
      instanceRef.current = null;
    }

    // Schedule initialization with a short delay to ensure DOM has updated
    initializationTimer.current = window.setTimeout(() => {
      try {
        if (elementRef.current && triggerRef.current) {
          instanceRef.current = createDraggable(elementRef.current, {
            trigger: triggerRef.current,
            ...options,
          });
          console.log('[Draggable] Instance initialized');

          // Enable if needed
          if (isDraggable && instanceRef.current) {
            instanceRef.current.enable();
          }
        }
      } catch (error) {
        console.error('[Draggable] Error creating instance:', error);
      }
      initializationTimer.current = null;
    }, 100);
  }, [elementRef, triggerRef, options, isDraggable]);

  // Initialize or clean up draggable based on isDraggable state
  useEffect(() => {
    if (isDraggable) {
      reinitializeDraggable();
    } else if (instanceRef.current) {
      instanceRef.current.disable();
    }

    return () => {
      // Clean up on unmount
      if (initializationTimer.current) {
        clearTimeout(initializationTimer.current);
      }

      if (instanceRef.current) {
        instanceRef.current.disable();
        instanceRef.current = null;
      }
    };
  }, [isDraggable, reinitializeDraggable]);

  // Add methods to set positions using the draggable instance
  const setX = useCallback(
    (x: number) => {
      if (instanceRef.current) {
        instanceRef.current.setX(x);
        console.log(`[Draggable] Setting X to ${x}`);
      } else if (elementRef.current) {
        // Fallback if instance is not available
        elementRef.current.style.left = `${x}px`;
        console.log(`[Draggable] Fallback setting X to ${x}`);
      }
    },
    [elementRef],
  );

  const setY = useCallback(
    (y: number) => {
      if (instanceRef.current) {
        instanceRef.current.setY(y);
        console.log(`[Draggable] Setting Y to ${y}`);
      } else if (elementRef.current) {
        // Fallback if instance is not available
        elementRef.current.style.top = `${y}px`;
        console.log(`[Draggable] Fallback setting Y to ${y}`);
      }
    },
    [elementRef],
  );

  const setSize = useCallback(
    (width: number, height: number) => {
      if (elementRef.current) {
        elementRef.current.style.width = `${width}px`;
        elementRef.current.style.height = `${height}px`;
      }
    },
    [elementRef],
  );

  return {
    isDraggable,
    enableDragging,
    disableDragging,
    reinitializeDraggable,
    setX,
    setY,
    setSize,
  };
}

// Define a type for the props of ModalContainer
interface ModalContainerProps {
  viewState: ModalState;
  style?: React.CSSProperties;
}

// Styled components
const ModalContainer = styled.div<ModalContainerProps>`
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
    props.viewState === 'full' &&
    `
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    border-radius: 0;
    transform: none !important;
  `}

  ${(props) =>
    props.viewState === 'pip' &&
    `
    width: 600px;
    height: 450px;
  `}
  
  ${(props) =>
    props.viewState === 'minimized' &&
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
    props.viewState === 'hidden' &&
    `
    display: none;
  `}
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

const ModalContent = styled.div<{ viewState: ModalState }>`
  ${(props) =>
    props.viewState === 'minimized' &&
    `
    display: none;
  `}

  height: calc(100% - 60px);
  overflow-y: auto;
  padding: ${(props) => (props.viewState === 'full' ? '20px' : '10px')};
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
  // Music player context
  const {
    currentSong,
    currentAlbum,
    isPlaying,
    modalState: contextModalState,
    setModalState: setContextModalState,
    playSong,
  } = useMusicPlayer();

  // Refs
  const modalRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const minimizeButtonRef = useRef<HTMLButtonElement>(null);
  const isFirstRender = useRef(true);
  const isUpdatingState = useRef(false);
  const lastStateChangeTime = useRef(Date.now());

  // Use reducer for state management
  const [state, dispatch] = useReducer(modalReducer, {
    view: contextModalState,
    previousView: null,
    mode: 'library',
    selectedAlbumId: null,
    refreshCounter: 0,
    hasMinimizedOnce: false,
  });

  // Handle state changes with debouncing to prevent rapid transitions
  const safeDispatch = useCallback((action: ModalAction) => {
    const now = Date.now();
    const timeSinceLastChange = now - lastStateChangeTime.current;

    // Prevent rapid state changes (debounce by 300ms)
    if (timeSinceLastChange < 300) {
      console.log('[State] Debouncing rapid state change');
      return;
    }

    // Set flags to track state updates
    isUpdatingState.current = true;
    lastStateChangeTime.current = now;

    // Dispatch the action
    dispatch(action);

    // Reset update flag after a delay
    setTimeout(() => {
      isUpdatingState.current = false;
    }, 300);
  }, []);

  // ONE-WAY sync: Only sync FROM context TO local state, not the other way
  useEffect(() => {
    // Skip if we're already updating to avoid loops
    if (isUpdatingState.current) {
      console.log('[State] Skipping context sync during local update');
      return;
    }

    // Only update if there's an actual difference
    if (contextModalState !== state.view) {
      console.log(`[State] Syncing from context: ${contextModalState}`);

      switch (contextModalState) {
        case 'full':
          dispatch({ type: 'ENTER_FULLSCREEN' });
          break;
        case 'pip':
          dispatch({ type: 'ENTER_PIP' });
          break;
        case 'minimized':
          dispatch({ type: 'MINIMIZE' });
          break;
        case 'hidden':
          dispatch({ type: 'HIDE' });
          break;
      }
    }
  }, [contextModalState, state.view]);

  // When local state changes, update the context
  useEffect(() => {
    // Skip initial render to avoid unnecessary updates
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Skip if we're handling a context-initiated change
    if (state.view === contextModalState) {
      return;
    }

    console.log(`[State] Updating context: ${state.view}`);
    setContextModalState(state.view);
  }, [state.view, setContextModalState, contextModalState]);

  // Use custom draggable hook
  const {
    isDraggable,
    enableDragging,
    disableDragging,
    reinitializeDraggable,
    setX,
    setY,
    setSize,
  } = useDraggable(modalRef, headerRef, { container: document.body });

  // Position calculation helper
  const getBottomRightPosition = useCallback(() => {
    const rightPos = Math.max(window.innerWidth - 650, 20);
    const bottomPos = Math.max(window.innerHeight - 500, 20);
    return { x: rightPos, y: bottomPos };
  }, []);

  const getCenterPosition = useCallback(() => {
    const modalWidth = 600;
    const modalHeight = 450;
    const x = Math.max(0, (window.innerWidth - modalWidth) / 2);
    const y = Math.max(0, (window.innerHeight - modalHeight) / 3);
    return { x, y };
  }, []);

  // Modal position and styling helpers
  const applyPipStyles = useCallback(() => {
    if (!modalRef.current) return;

    const position = getCenterPosition();

    // Set size first
    setSize(600, 450);

    // Use the setX/setY methods for positioning
    setX(position.x);
    setY(position.y);

    // Additional styling that doesn't affect position
    if (modalRef.current) {
      modalRef.current.style.bottom = 'auto';
      modalRef.current.style.right = 'auto';
      modalRef.current.style.borderRadius = '8px';
    }

    // Force a reflow
    const pipReflowTrigger = modalRef.current.offsetHeight;
  }, [getCenterPosition, setSize, setX, setY]);

  const applyFullscreenStyles = useCallback(() => {
    if (!modalRef.current) return;

    // For fullscreen, we want to disable dragging first
    disableDragging();

    // Directly modify the styles for fullscreen
    if (modalRef.current) {
      modalRef.current.style.width = '100vw';
      modalRef.current.style.height = '100vh';
      modalRef.current.style.top = '0';
      modalRef.current.style.left = '0';
      modalRef.current.style.borderRadius = '0';
    }

    // Force a reflow
    const fullscreenReflowTrigger = modalRef.current.offsetHeight;
  }, [disableDragging]);

  const applyMinimizedStyles = useCallback(() => {
    if (!modalRef.current) return;

    // For minimized state, disable dragging first
    disableDragging();

    // For minimized state, just modify the styles directly
    if (modalRef.current) {
      modalRef.current.style.width = '240px';
      modalRef.current.style.height = '40px';
      modalRef.current.style.top = 'auto';
      modalRef.current.style.left = 'auto';
      modalRef.current.style.position = 'fixed';
      modalRef.current.style.bottom = '150px';
      modalRef.current.style.right = '20px';
      modalRef.current.style.borderRadius = '8px';
    }

    // Force a reflow
    const minimizedReflowTrigger = modalRef.current.offsetHeight;
  }, [disableDragging]);

  // First minimize is now tracked in reducer state

  const handleMinimize = useCallback(() => {
    // Use the reducer's state to track first minimize
    if (!state.hasMinimizedOnce) {
      console.log('[Action] First minimize - using special action');
      // For the first minimize, use our special action
      safeDispatch({ type: 'FIRST_MINIMIZE' });
    } else {
      // For subsequent minimizes, use the regular action
      safeDispatch({ type: 'MINIMIZE' });
    }

    // Apply minimized styles immediately for smoother transition
    applyMinimizedStyles();
  }, [safeDispatch, applyMinimizedStyles, state.hasMinimizedOnce]);

  // Prevent scrolling on all containers when in fullscreen mode
  useEffect(() => {
    if (state.view === 'full') {
      // Disable scrolling on document body
      document.body.style.overflow = 'hidden';

      // Also disable scrolling on the fullpage scroll container if it exists
      const fullpageContainer = document.querySelector(
        '.fullpage-scroll-container',
      );
      if (fullpageContainer) {
        (fullpageContainer as HTMLElement).style.overflow = 'hidden';
      }

      // Disable scrolling on the impact-report container if it exists
      const impactReport = document.querySelector('.impact-report');
      if (impactReport) {
        (impactReport as HTMLElement).style.overflow = 'hidden';
      }

      return () => {
        // Restore scrolling on body
        document.body.style.overflow = '';

        // Restore scrolling on fullpage container
        if (fullpageContainer) {
          (fullpageContainer as HTMLElement).style.overflow = 'scroll';
        }

        // Restore scrolling on impact report
        if (impactReport) {
          (impactReport as HTMLElement).style.overflow = '';
        }
      };
    }

    // Ensure scrolling is enabled when not in fullscreen
    document.body.style.overflow = '';

    // Re-enable fullpage container scrolling
    const fullpageContainer = document.querySelector(
      '.fullpage-scroll-container',
    );
    if (fullpageContainer) {
      (fullpageContainer as HTMLElement).style.overflow = 'scroll';
    }

    // Restore impact report overflow
    const impactReport = document.querySelector('.impact-report');
    if (impactReport) {
      (impactReport as HTMLElement).style.overflow = '';
    }

    return undefined;
  }, [state.view]);

  // Make the modal start in fullscreen mode on first render
  useEffect(() => {
    // Use a ref so this only runs once regardless of state changes
    if (isFirstRender.current && state.view !== 'hidden') {
      // If not already in fullscreen, change to fullscreen
      if (state.view !== 'full') {
        console.log('[State] First render - initializing to fullscreen');
        // Use direct dispatch, not safeDispatch, for initialization
        dispatch({ type: 'ENTER_FULLSCREEN' });
        // Apply fullscreen styles immediately
        setTimeout(applyFullscreenStyles, 50);
      }
      // Mark first render as complete
      isFirstRender.current = false;
    }
  }, [state.view, applyFullscreenStyles]);

  // Manage draggable behavior based on modal state
  useEffect(() => {
    if (state.view === 'pip') {
      // Position the modal first
      applyPipStyles();

      // Then enable dragging with a delay to ensure styles are applied
      setTimeout(() => {
        enableDragging();
        console.log('[Modal] Enabled dragging for PiP mode');
      }, 100);
    } else {
      // For non-pip modes, always disable dragging
      disableDragging();
      console.log(`[Modal] Disabled dragging for ${state.view} mode`);

      if (state.view === 'minimized') {
        applyMinimizedStyles();
      } else if (state.view === 'full') {
        applyFullscreenStyles();
      }
    }
  }, [
    state.view,
    enableDragging,
    disableDragging,
    applyPipStyles,
    applyMinimizedStyles,
    applyFullscreenStyles,
  ]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (state.view === 'pip' && modalRef.current) {
        // Ensure modal stays within viewport
        const rect = modalRef.current.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width;
        const maxY = window.innerHeight - rect.height;

        let repositioned = false;

        // Check if the modal is out of bounds horizontally
        if (rect.right > window.innerWidth || rect.left < 0) {
          const newX = Math.min(Math.max(0, rect.left), maxX);
          setX(newX);
          console.log(`[Modal] Repositioning X to ${newX}`);
          repositioned = true;
        }

        // Check if the modal is out of bounds vertically
        if (rect.bottom > window.innerHeight || rect.top < 0) {
          const newY = Math.min(Math.max(0, rect.top), maxY);
          setY(newY);
          console.log(`[Modal] Repositioning Y to ${newY}`);
          repositioned = true;
        }

        // Only reinitialize if we had to reposition
        if (repositioned) {
          reinitializeDraggable();
          console.log('[Modal] Reinitialized draggable after repositioning');
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [state.view, reinitializeDraggable, setX, setY]);

  // State transition effect for content refreshing
  useEffect(() => {
    // Only run if this is a pip-to-full transition
    if (state.view === 'full' && state.previousView === 'pip') {
      console.log('[Transition] PiP to fullscreen - refreshing content');

      // Apply styles first
      applyFullscreenStyles();

      // Force a refresh after transition completes
      setTimeout(() => {
        if (state.view === 'full') {
          // Verify we're still in fullscreen
          dispatch({ type: 'REFRESH_CONTENT' });
        }
      }, 350); // Longer delay to ensure transition has completed
    }
  }, [state.view, state.previousView, applyFullscreenStyles]);

  // Simplified action handlers
  const handleEnterFullscreen = useCallback(() => {
    safeDispatch({ type: 'ENTER_FULLSCREEN' });
    applyFullscreenStyles();
  }, [safeDispatch, applyFullscreenStyles]);

  const handleEnterPip = useCallback(() => {
    safeDispatch({ type: 'ENTER_PIP' });
    applyPipStyles();
    // Delay draggable initialization until transition is complete
    setTimeout(reinitializeDraggable, 300);
  }, [safeDispatch, applyPipStyles, reinitializeDraggable]);

  const handleButtonClick = useCallback(
    (e: React.MouseEvent | MouseEvent) => {
      if (!(e.target instanceof Element)) return;

      const button = e.target.closest('button');
      if (!button) return;

      const action = button.getAttribute('aria-label');
      if (!action) return;

      e.stopPropagation();
      e.preventDefault();

      // Map actions to handlers with specific state checks
      const actions = {
        'Picture in Picture': () => {
          if (state.view === 'full') {
            console.log('[Action] Fullscreen to PiP');
            handleEnterPip();
          }
        },
        Fullscreen: () => {
          if (state.view === 'pip') {
            console.log('[Action] PiP to Fullscreen');
            handleEnterFullscreen();
          }
        },
        Minimize: () => {
          if (state.view === 'pip') {
            console.log('[Action] PiP to Minimized');
            handleMinimize();
          }
        },
        Expand: () => {
          if (state.view === 'minimized') {
            console.log('[Action] Minimized to PiP');
            // First apply styles for a smoother transition
            applyPipStyles();
            // Then update state
            safeDispatch({ type: 'ENTER_PIP' });
            // Initialize draggable after transition
            setTimeout(reinitializeDraggable, 300);
          }
        },
      };

      // Execute the matching action
      const actionFn = actions[action as keyof typeof actions];
      if (actionFn) actionFn();
    },
    [
      state.view,
      handleEnterFullscreen,
      handleEnterPip,
      handleMinimize,
      safeDispatch,
      applyPipStyles,
      reinitializeDraggable,
    ],
  );

  // Attach click handler to header
  useEffect(() => {
    const headerElement = headerRef.current;
    if (!headerElement) return;

    headerElement.addEventListener('click', handleButtonClick as EventListener);

    return () => {
      headerElement.removeEventListener(
        'click',
        handleButtonClick as EventListener,
      );
    };
  }, [handleButtonClick]);

  // Content management handlers
  const handleAlbumClick = useCallback((albumId: string) => {
    dispatch({ type: 'SET_ALBUM', albumId });
    dispatch({ type: 'SET_MODE', mode: 'album' });
  }, []);

  const handleLibraryClick = useCallback(() => {
    dispatch({ type: 'SET_ALBUM', albumId: null });
    dispatch({ type: 'SET_MODE', mode: 'library' });
  }, []);

  const handlePlayTrack = useCallback(
    (song: any, album: any) => {
      playSong(song, album);
    },
    [playSong],
  );

  // UI Helpers
  const getHeaderTitle = useCallback(() => {
    if (state.view === 'minimized') {
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

    switch (state.mode) {
      case 'album':
        return 'Album View';
      default:
        return (
          <HeaderTitle>
            <MusicNoteIcon /> GOGO Music Library
          </HeaderTitle>
        );
    }
  }, [state.view, state.mode, currentSong, currentAlbum]);

  // Skip rendering if hidden
  if (state.view === 'hidden') {
    return null;
  }

  return (
    <ModalContainer ref={modalRef} viewState={state.view}>
      <ModalHeader ref={headerRef} viewState={state.view}>
        <DragHandle />
        {getHeaderTitle()}

        <HeaderControls>
          {/* Show fullscreen/pip toggle only when not minimized */}
          {state.view !== 'minimized' && (
            <>
              {state.view === 'full' ? (
                <ControlButton
                  onClick={handleButtonClick}
                  aria-label="Picture in Picture"
                  title="Enter Picture in Picture mode"
                >
                  <PictureInPictureIcon />
                </ControlButton>
              ) : (
                <ControlButton
                  onClick={handleButtonClick}
                  aria-label="Fullscreen"
                  title="Enter Fullscreen mode"
                >
                  <FullscreenIcon />
                </ControlButton>
              )}

              {/* Show minimize button only in pip mode */}
              {state.view === 'pip' && (
                <ControlButton
                  ref={minimizeButtonRef}
                  onClick={handleButtonClick}
                  aria-label="Minimize"
                  title="Minimize player"
                >
                  <MinimizeIcon />
                </ControlButton>
              )}
            </>
          )}

          {/* Expand button in minimized mode */}
          {state.view === 'minimized' && (
            <ControlButton
              onClick={handleButtonClick}
              aria-label="Expand"
              title="Expand player to PiP mode"
            >
              <ExpandIcon />
            </ControlButton>
          )}
        </HeaderControls>
      </ModalHeader>

      <ModalContent
        viewState={state.view}
        data-modal-content
        key={state.refreshCounter} // Force re-render when refreshCounter changes
      >
        {state.view !== 'minimized' && (
          <>
            {/* Only show mode selector in full mode */}
            {state.view === 'full' && (
              <ModeSelector>
                <ModeButton
                  active={state.mode === 'library'}
                  onClick={handleLibraryClick}
                >
                  Library
                </ModeButton>
                {state.selectedAlbumId && (
                  <ModeButton
                    active={state.mode === 'album'}
                    onClick={() =>
                      dispatch({ type: 'SET_MODE', mode: 'album' })
                    }
                  >
                    Album
                  </ModeButton>
                )}
              </ModeSelector>
            )}

            {/* Content based on mode */}
            {state.mode === 'album' && state.selectedAlbumId ? (
              <AlbumView
                albumId={state.selectedAlbumId}
                onPlayTrack={handlePlayTrack}
                onBackClick={handleLibraryClick}
                currentlyPlayingId={currentSong?.song_id || null}
                isPlaying={isPlaying}
                modalState={state.view}
              />
            ) : (
              <MusicLibrary
                onAlbumClick={handleAlbumClick}
                onPlayTrack={handlePlayTrack}
                currentlyPlayingId={currentSong?.song_id || null}
                isPlaying={isPlaying}
                modalState={state.view}
              />
            )}
          </>
        )}
      </ModalContent>
    </ModalContainer>
  );
}

export default DraggableMusicModal;
