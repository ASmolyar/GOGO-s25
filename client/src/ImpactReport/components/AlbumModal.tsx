import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import COLORS from '../../assets/colors';
import { Album, Song } from '../types/music';
import { getAlbumById } from '../services/musicService';

interface AlbumModalProps {
  albumId: string;
  onPlayTrack: (song: Song, album: Album) => void;
  onClose: () => void;
}

// Styled components
const ModalContent = styled.div`
  width: 100%;
  padding: 0;
`;

const HeaderContainer = styled.div`
  position: relative;
  padding-bottom: 24px;
  margin-bottom: 24px;
`;

const HeaderBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 300px;
  background: linear-gradient(to bottom, #121212, rgba(18, 18, 18, 0.5));
  z-index: 0;
  border-radius: 8px 8px 0 0;
`;

const HeaderContent = styled.div`
  position: relative;
  z-index: 1;
  padding: 32px;
  display: flex;
  align-items: flex-end;
  gap: 24px;
`;

const AlbumCover = styled.div<{ imageUrl: string }>`
  width: 232px;
  height: 232px;
  background-image: url(${(props) => props.imageUrl});
  background-size: cover;
  background-position: center;
  box-shadow: 0 4px 60px rgba(0, 0, 0, 0.5);
`;

const AlbumInfo = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 800px;
  width: 100%;
`;

const AlbumType = styled.div`
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 700;
  color: white;
  margin-bottom: 8px;
`;

const AlbumTitle = styled.h1`
  font-size: 3rem;
  font-weight: 900;
  color: white;
  margin: 0 0 16px 0;
  line-height: 1.1;
`;

const ArtistsDisplay = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: white;
  margin-bottom: 16px;
`;

const AlbumLink = styled.a`
  color: ${COLORS.gogo_blue};
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 16px;

  &:hover {
    text-decoration: underline;
  }
`;

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
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

const TracksContainer = styled.div`
  padding: 0 32px;
`;

const TracksHeader = styled.div`
  display: grid;
  grid-template-columns: 40px minmax(300px, 4fr) minmax(200px, 2fr) 80px;
  padding: 0 16px 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 16px;
`;

const TracksHeaderCell = styled.div`
  color: #b3b3b3;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 500;
`;

const TrackRow = styled.div`
  display: grid;
  grid-template-columns: 40px minmax(300px, 4fr) minmax(200px, 2fr) 80px;
  padding: 10px 16px;
  border-radius: 4px;
  align-items: center;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const TrackNumber = styled.div`
  font-size: 16px;
  color: #b3b3b3;
  text-align: center;
  font-weight: 500;
`;

const TrackInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const TrackTitle = styled.div`
  font-size: 16px;
  color: white;
  font-weight: 500;
`;

const ArtistNames = styled.div`
  font-size: 14px;
  color: #b3b3b3;
`;

const TrackDuration = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 14px;
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

// Helper function to calculate duration
const calculateDuration = (): string => {
  // Random duration between 2 and 5 minutes
  const minutes = Math.floor(Math.random() * 3) + 2;
  const seconds = Math.floor(Math.random() * 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

function AlbumModal({
  albumId,
  onPlayTrack,
  onClose,
}: AlbumModalProps): JSX.Element {
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [trackDurations, setTrackDurations] = useState<Record<string, string>>(
    {},
  );

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        setLoading(true);
        // Use the musicService to fetch the album by ID directly
        const foundAlbum = await getAlbumById(albumId);

        if (!foundAlbum) {
          throw new Error(`Album with ID ${albumId} not found`);
        }

        setAlbum(foundAlbum);
        setLoading(false);
      } catch (err) {
        console.error('Error loading album:', err);
        setError('Could not load the album. Please try again later.');
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [albumId]);

  const handlePlaySong = (song: Song) => {
    if (album) {
      setCurrentlyPlaying(song.song_id);
      onPlayTrack(song, album);
    }
  };

  const handlePlayAlbum = () => {
    if (album && album.songs.length > 0) {
      handlePlaySong(album.songs[0]);
    }
  };

  if (loading) {
    return (
      <ModalContent>
        <LoadingContainer>Loading album...</LoadingContainer>
      </ModalContent>
    );
  }

  if (error) {
    return (
      <ModalContent>
        <ErrorContainer>{error}</ErrorContainer>
      </ModalContent>
    );
  }

  if (!album) {
    return (
      <ModalContent>
        <ErrorContainer>Album not found.</ErrorContainer>
      </ModalContent>
    );
  }

  return (
    <ModalContent>
      <HeaderContainer>
        <HeaderBackground />
        <HeaderContent>
          <AlbumCover imageUrl={album.cover} />
          <AlbumInfo>
            <AlbumType>{album.type.toUpperCase()}</AlbumType>
            <AlbumTitle>{album.name}</AlbumTitle>
            <ArtistsDisplay>
              {album.artists &&
                album.artists.map((artist) => artist.name).join(', ')}
            </ArtistsDisplay>
            {album.album_url && (
              <AlbumLink
                href={album.album_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Streaming Platforms
              </AlbumLink>
            )}
            <HeaderControls>
              <GreenPlayButton onClick={handlePlayAlbum}>▶</GreenPlayButton>
            </HeaderControls>
          </AlbumInfo>
        </HeaderContent>
      </HeaderContainer>

      <TracksContainer>
        <TracksHeader>
          <TracksHeaderCell>#</TracksHeaderCell>
          <TracksHeaderCell>Title</TracksHeaderCell>
          <TracksHeaderCell>Artist</TracksHeaderCell>
          <TracksHeaderCell style={{ textAlign: 'right' }}>
            Duration
          </TracksHeaderCell>
        </TracksHeader>

        {album.songs.map((song, index) => (
          <TrackRow key={song.song_id} onClick={() => handlePlaySong(song)}>
            <TrackNumber>
              {currentlyPlaying === song.song_id ? '▶' : index + 1}
            </TrackNumber>
            <TrackInfo>
              <TrackTitle>{song.title}</TrackTitle>
            </TrackInfo>
            <ArtistNames>
              {song.artists && song.artists.length > 0
                ? song.artists.map((artist) => artist.name).join(', ')
                : album.artists &&
                  album.artists.map((artist) => artist.name).join(', ')}
            </ArtistNames>
            <TrackDuration>
              {/* In a real app we would store durations in the song data */}
              {calculateDuration()}
            </TrackDuration>
          </TrackRow>
        ))}
      </TracksContainer>
    </ModalContent>
  );
}

export default AlbumModal;
