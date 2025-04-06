import React, { useState } from 'react';
import styled from 'styled-components';
import COLORS from '../../assets/colors.ts';

interface Track {
  title: string;
  artist: string;
  cover: string;
  duration: string;
}

interface NowPlayingBarProps {
  currentTrack?: Track;
  isPlaying?: boolean;
  onPlayPause?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

const BarContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 90px;
  background-color: #181818;
  border-top: 1px solid #282828;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 100;
`;

const NowPlayingLeft = styled.div`
  display: flex;
  align-items: center;
  width: 30%;
  min-width: 180px;
`;

const NowPlayingCenter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 40%;
  max-width: 722px;
`;

const NowPlayingRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 30%;
  min-width: 180px;
`;

const CoverArt = styled.div<{ cover: string }>`
  width: 56px;
  height: 56px;
  background-image: url(${(props) => props.cover});
  background-size: cover;
  background-position: center;
  margin-right: 14px;
  flex-shrink: 0;
`;

const SongInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
`;

const SongTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: white;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

const SongArtist = styled.div`
  font-size: 11px;
  color: #b3b3b3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    text-decoration: underline;
    color: white;
    cursor: pointer;
  }
`;

const LikeButton = styled.button`
  background: transparent;
  border: none;
  color: #b3b3b3;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 16px;
  cursor: pointer;

  &:hover {
    color: white;
  }

  &.active {
    color: ${COLORS.gogo_blue};
  }
`;

const PlayerControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 12px;
`;

const ControlButton = styled.button`
  background: transparent;
  border: none;
  color: #b3b3b3;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    color: white;
  }

  &.large {
    width: 32px;
    height: 32px;
  }
`;

const PlayButton = styled(ControlButton)`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: white;
  color: black;

  &:hover {
    transform: scale(1.06);
    color: black;
  }
`;

const ProgressBar = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 8px;
`;

const TimeInfo = styled.div`
  font-size: 11px;
  color: #b3b3b3;
  min-width: 40px;
  text-align: center;
`;

const ProgressContainer = styled.div`
  flex: 1;
  height: 4px;
  background-color: #535353;
  border-radius: 2px;
  position: relative;
  cursor: pointer;

  &:hover .progress-handle {
    opacity: 1;
  }

  &:hover .progress-fill {
    background-color: ${COLORS.gogo_blue};
  }
`;

const ProgressFill = styled.div.attrs<{ width: string }>((props) => ({
  style: {
    width: props.width,
  },
}))<{ width: string }>`
  height: 100%;
  background-color: #b3b3b3;
  border-radius: 2px;
  position: relative;
`;

const ProgressHandle = styled.div.attrs<{ left: string }>((props) => ({
  style: {
    left: props.left,
  },
}))<{ left: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: white;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 2;
  pointer-events: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

const VolumeControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const VolumeContainer = styled.div`
  width: 93px;
  height: 4px;
  background-color: #535353;
  border-radius: 2px;
  position: relative;
  cursor: pointer;

  &:hover .volume-handle {
    opacity: 1;
  }

  &:hover .volume-fill {
    background-color: ${COLORS.gogo_blue};
  }
`;

const VolumeFill = styled.div.attrs<{ width: string }>((props) => ({
  style: {
    width: props.width,
  },
}))<{ width: string }>`
  height: 100%;
  background-color: #b3b3b3;
  border-radius: 2px;
`;

const VolumeHandle = styled.div.attrs<{ left: string }>((props) => ({
  style: {
    left: props.left,
  },
}))<{ left: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: white;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 2;
  pointer-events: none;
`;

// SVG Icons
const PlayIcon = () => (
  <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path>
  </svg>
);

const PauseIcon = () => (
  <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"></path>
  </svg>
);

const PrevIcon = () => (
  <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.575a.7.7 0 0 1-1.05.607L4 9.149V14.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7h1.6z"></path>
  </svg>
);

const NextIcon = () => (
  <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-1.6z"></path>
  </svg>
);

const ShuffleIcon = () => (
  <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M13.151.922a.75.75 0 1 0-1.06 1.06L13.109 3H11.16a3.75 3.75 0 0 0-2.873 1.34l-6.173 7.356A2.25 2.25 0 0 1 .39 12.5H0V14h.391a3.75 3.75 0 0 0 2.873-1.34l6.173-7.356a2.25 2.25 0 0 1 1.724-.804h1.947l-1.017 1.018a.75.75 0 0 0 1.06 1.06L16.5 3.25 13.151.922zM.391 3.5H0V2h.391c1.109 0 2.16.49 2.873 1.34L4.89 5.277l-.979 1.167-1.796-2.14A2.25 2.25 0 0 0 .39 3.5z"></path>
    <path d="m7.5 10.723.98-1.167.957 1.14a2.25 2.25 0 0 0 1.724.804h1.947l-1.017-1.018a.75.75 0 1 1 1.06-1.06l3.329 3.328-3.33 3.328a.75.75 0 1 1-1.06-1.06L13.109 13H11.16a3.75 3.75 0 0 1-2.873-1.34l-.787-.938z"></path>
  </svg>
);

const RepeatIcon = () => (
  <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M0 4.75A3.75 3.75 0 0 1 3.75 1h8.5A3.75 3.75 0 0 1 16 4.75v5a3.75 3.75 0 0 1-3.75 3.75H9.81l1.018 1.018a.75.75 0 1 1-1.06 1.06L6.939 12.75l2.829-2.828a.75.75 0 1 1 1.06 1.06L9.811 12h2.439a2.25 2.25 0 0 0 2.25-2.25v-5a2.25 2.25 0 0 0-2.25-2.25h-8.5A2.25 2.25 0 0 0 1.5 4.75v5A2.25 2.25 0 0 0 3.75 12H5v1.5H3.75A3.75 3.75 0 0 1 0 9.75v-5z"></path>
  </svg>
);

const HeartIcon = () => (
  <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M1.69 2A4.582 4.582 0 0 1 8 2.023 4.583 4.583 0 0 1 11.88.817h.002a4.618 4.618 0 0 1 3.782 3.65v.003a4.543 4.543 0 0 1-1.011 3.84L9.35 14.629a1.765 1.765 0 0 1-2.093.464 1.762 1.762 0 0 1-.605-.463L1.348 8.309A4.582 4.582 0 0 1 1.689 2zm3.158.252A3.082 3.082 0 0 0 2.49 7.337l.005.005L7.8 13.664a.264.264 0 0 0 .311.069.262.262 0 0 0 .09-.069l5.312-6.33a3.043 3.043 0 0 0 .68-2.573 3.118 3.118 0 0 0-2.551-2.463 3.079 3.079 0 0 0-2.612.816l-.007.007a1.501 1.501 0 0 1-2.045 0l-.009-.008a3.082 3.082 0 0 0-2.121-.861z"></path>
  </svg>
);

const PictureInPictureIcon = () => (
  <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M1 4.75C1 3.784 1.784 3 2.75 3h10.5c.966 0 1.75.784 1.75 1.75v6.5A1.75 1.75 0 0 1 13.25 13H2.75A1.75 1.75 0 0 1 1 11.25v-6.5zm1.75-.25a.25.25 0 0 0-.25.25v6.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-6.5a.25.25 0 0 0-.25-.25H2.75z"></path>
    <path d="M9 8.75A.75.75 0 0 1 9.75 8h2.5a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1-.75-.75v-2.5z"></path>
  </svg>
);

const VolumeHighIcon = () => (
  <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88z"></path>
    <path d="M11.5 13.614a5.752 5.752 0 0 0 0-11.228v1.55a4.252 4.252 0 0 1 0 8.127v1.55z"></path>
  </svg>
);

const VolumeMediumIcon = () => (
  <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88z"></path>
  </svg>
);

const VolumeLowIcon = () => (
  <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35z"></path>
  </svg>
);

const VolumeMuteIcon = () => (
  <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M13.86 5.47a.75.75 0 0 0-1.061 0l-1.47 1.47-1.47-1.47A.75.75 0 0 0 8.8 6.53L10.269 8l-1.47 1.47a.75.75 0 1 0 1.06 1.06l1.47-1.47 1.47 1.47a.75.75 0 0 0 1.06-1.06L12.39 8l1.47-1.47a.75.75 0 0 0 0-1.06z"></path>
    <path d="M10.116 1.5A.75.75 0 0 0 8.991.85l-6.925 4a3.642 3.642 0 0 0-1.33 4.967 3.639 3.639 0 0 0 1.33 1.332l6.925 4a.75.75 0 0 0 1.125-.649v-1.906a4.73 4.73 0 0 1-1.5-.694v1.3L2.817 9.852a2.141 2.141 0 0 1-.781-2.92c.187-.324.456-.594.78-.782l5.8-3.35v1.3c.45-.313.956-.55 1.5-.694V1.5z"></path>
  </svg>
);

const NowPlayingBar: React.FC<NowPlayingBarProps> = ({
  currentTrack = {
    title: 'Urban Rhythms',
    artist: 'Chicago Youth Ensemble',
    cover: '/music/albums/student_performances/cover.jpg',
    duration: '3:45',
  },
  isPlaying = false,
  onPlayPause = () => {},
  onNext = () => {},
  onPrevious = () => {},
}) => {
  const [progress, setProgress] = useState(30); // 0-100
  const [volume, setVolume] = useState(70); // 0-100
  const [liked, setLiked] = useState(false);

  // Format time from seconds to MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Calculate current time based on progress
  const currentTime = Math.floor((progress / 100) * 225); // Assuming 3:45 = 225 seconds

  // Handle volume icon based on volume level
  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeMuteIcon />;
    if (volume < 33) return <VolumeLowIcon />;
    if (volume < 66) return <VolumeMediumIcon />;
    return <VolumeHighIcon />;
  };

  return (
    <BarContainer>
      <NowPlayingLeft>
        {currentTrack && (
          <>
            <CoverArt cover={currentTrack.cover} />
            <SongInfo>
              <SongTitle>{currentTrack.title}</SongTitle>
              <SongArtist>{currentTrack.artist}</SongArtist>
            </SongInfo>
            <LikeButton
              className={liked ? 'active' : ''}
              onClick={() => setLiked(!liked)}
              aria-label={liked ? 'Unlike' : 'Like'}
            >
              <HeartIcon />
            </LikeButton>
          </>
        )}
      </NowPlayingLeft>

      <NowPlayingCenter>
        <PlayerControls>
          <ControlButton aria-label="Shuffle">
            <ShuffleIcon />
          </ControlButton>
          <ControlButton aria-label="Previous" onClick={onPrevious}>
            <PrevIcon />
          </ControlButton>
          <PlayButton
            className="large"
            onClick={onPlayPause}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </PlayButton>
          <ControlButton aria-label="Next" onClick={onNext}>
            <NextIcon />
          </ControlButton>
          <ControlButton aria-label="Repeat">
            <RepeatIcon />
          </ControlButton>
        </PlayerControls>

        <ProgressBar>
          <TimeInfo>{formatTime(currentTime)}</TimeInfo>
          <ProgressContainer
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickPosition = e.clientX - rect.left;
              const newProgress = (clickPosition / rect.width) * 100;
              setProgress(Math.max(0, Math.min(100, newProgress)));
            }}
          >
            <ProgressFill width={`${progress}%`} className="progress-fill" />
            <ProgressHandle left={`${progress}%`} className="progress-handle" />
          </ProgressContainer>
          <TimeInfo>{currentTrack.duration}</TimeInfo>
        </ProgressBar>
      </NowPlayingCenter>

      <NowPlayingRight>
        <ControlButton aria-label="Picture in Picture">
          <PictureInPictureIcon />
        </ControlButton>
        <VolumeControls>
          <ControlButton
            aria-label={volume === 0 ? 'Unmute' : 'Mute'}
            onClick={() => setVolume(volume === 0 ? 70 : 0)}
          >
            {getVolumeIcon()}
          </ControlButton>
          <VolumeContainer
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickPosition = e.clientX - rect.left;
              const newVolume = (clickPosition / rect.width) * 100;
              setVolume(Math.max(0, Math.min(100, newVolume)));
            }}
          >
            <VolumeFill width={`${volume}%`} className="volume-fill" />
            <VolumeHandle left={`${volume}%`} className="volume-handle" />
          </VolumeContainer>
        </VolumeControls>
      </NowPlayingRight>
    </BarContainer>
  );
};

export default NowPlayingBar;
