import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import COLORS from '../../assets/colors.ts';

// Internal Track interface for the music catalog
interface CatalogTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  file: string;
}

// Album interface using CatalogTrack
interface Album {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  year: string;
  tracks: CatalogTrack[];
}

// External Track interface for the Now Playing bar
interface PlaybackTrack {
  id: string;
  title: string;
  artist: string;
  cover: string;
  duration: string;
  audioSrc?: string;
}

interface MusicCatalog {
  albums: Album[];
}

interface MusicLibraryProps {
  onArtistClick: (artistId: string) => void;
  onPlayTrack: (track: PlaybackTrack) => void;
}

// Styled components
const MusicLibraryContainer = styled.div`
  width: 100%;
  max-width: 1800px;
  margin: 0 auto;
  padding: 24px 32px;
`;

const PageSection = styled.div`
  margin-bottom: 40px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin: 0;
`;

const SeeAllLink = styled.a`
  color: #b3b3b3;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  
  &:hover {
    color: white;
    text-decoration: underline;
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 24px;
`;

const Card = styled.div`
  background: #181818;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background: #282828;
  }
`;

const CardCover = styled.div<{ url: string }>`
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: 4px;
  background-image: url(${props => props.url});
  background-size: cover;
  background-position: center;
  margin-bottom: 16px;
  position: relative;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(to top, rgba(0,0,0,0.5), transparent);
    border-radius: 4px;
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
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #1db954;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(8px);
  transition: all 0.3s ease;
  z-index: 2;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  
  ${Card}:hover & {
    opacity: 1;
    transform: translateY(0);
  }
  
  &:hover {
    transform: scale(1.1) !important;
    background: #1ed760;
  }
`;

const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardDescription = styled.p`
  font-size: 14px;
  color: #b3b3b3;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DailyMixGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 24px;
  margin-top: 24px;
`;

const DailyMixCard = styled.div`
  background: #181818;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background: #282828;
  }
`;

const DailyMixCover = styled.div<{ color: string, number: number }>`
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: 4px;
  background: ${props => props.color};
  margin-bottom: 16px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  
  &::before {
    content: '${props => props.number}';
    position: absolute;
    bottom: 8px;
    right: 8px;
    font-size: 36px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.7);
  }
`;

const DailyMixTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;
`;

const DailyMixDescription = styled.p`
  font-size: 14px;
  color: #b3b3b3;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const NoAlbumsMessage = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #b3b3b3;
`;

const AlbumDetailView = styled.div`
  background: linear-gradient(180deg, #313131 0%, #181818 100%);
  border-radius: 8px;
  padding: 24px;
  margin-top: 24px;
`;

const AlbumHeader = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
`;

const AlbumCoverLarge = styled.div<{ url: string }>`
  width: 232px;
  height: 232px;
  border-radius: 4px;
  background-image: url(${props => props.url});
  background-size: cover;
  background-position: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
`;

const AlbumInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const AlbumType = styled.p`
  font-size: 14px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;
  text-transform: uppercase;
`;

const AlbumTitleLarge = styled.h1`
  font-size: 36px;
  font-weight: 900;
  color: white;
  margin: 0 0 16px 0;
`;

const AlbumMetadata = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #b3b3b3;
`;

const TrackList = styled.div`
  margin-top: 32px;
`;

const TrackHeader = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr 120px;
  padding: 0 16px 8px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const HeaderCell = styled.div`
  font-size: 14px;
  color: #b3b3b3;
  text-transform: uppercase;
`;

const TrackRow = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr 120px;
  padding: 8px 16px;
  border-radius: 4px;
  align-items: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const TrackNumber = styled.div`
  font-size: 16px;
  color: #b3b3b3;
`;

const TrackDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const TrackTitle = styled.span`
  font-size: 16px;
  color: white;
  margin-bottom: 4px;
`;

const TrackArtist = styled.span`
  font-size: 14px;
  color: #b3b3b3;
`;

const TrackDuration = styled.div`
  font-size: 14px;
  color: #b3b3b3;
  text-align: right;
`;

// Adding a styled component for the featured album section
const FeaturedAlbumSection = styled.div`
  margin-bottom: 48px;
  padding: 24px;
  background: linear-gradient(135deg, #121212 0%, #1e1e1e 50%, ${COLORS.gogo_blue}22 100%);
  border-radius: 8px;
  display: flex;
  gap: 24px;
  position: relative;
  overflow: hidden;
`;

const FeaturedAlbumCover = styled.div<{ image: string }>`
  width: 232px;
  height: 232px;
  border-radius: 4px;
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  flex-shrink: 0;
`;

const FeaturedAlbumInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const FeaturedAlbumBadge = styled.div`
  background-color: ${COLORS.gogo_blue};
  color: white;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FeaturedAlbumTitle = styled.h2`
  font-size: 32px;
  font-weight: 900;
  color: white;
  margin: 0 0 8px 0;
`;

const FeaturedAlbumArtist = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #b3b3b3;
  margin: 0 0 16px 0;
`;

const FeaturedAlbumDescription = styled.p`
  font-size: 14px;
  color: #b3b3b3;
  margin: 0 0 24px 0;
  line-height: 1.5;
  max-width: 700px;
`;

const FeaturedTrackList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const FeaturedTrack = styled.div`
  padding: 8px 16px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const FeaturedTrackTitle = styled.span`
  font-size: 14px;
  color: white;
`;

const FeaturedTrackDuration = styled.span`
  font-size: 12px;
  color: #b3b3b3;
`;

const PlayIcon = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: white;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
`;

// Main component
const MusicLibrary: React.FC<MusicLibraryProps> = ({ onArtistClick, onPlayTrack }) => {
  const [catalog, setCatalog] = useState<MusicCatalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Daily mix data
  const dailyMixes = [
    {
      id: 'daily-mix-1',
      title: 'Daily Mix 1',
      color: COLORS.gogo_blue,
      number: 1,
      description: 'Dire Straits, King Krule, Daryl Hall & more'
    },
    {
      id: 'daily-mix-2',
      title: 'Daily Mix 2',
      color: COLORS.gogo_yellow,
      number: 2,
      description: 'Yuri Vizbor, Zoya Yashchenko, Floran & more'
    },
    {
      id: 'daily-mix-3',
      title: 'Daily Mix 3',
      color: COLORS.gogo_pink,
      number: 3,
      description: 'Tom Misch, Karl Onibuje, Parcels & more'
    },
    {
      id: 'daily-mix-4',
      title: 'Daily Mix 4',
      color: COLORS.gogo_purple,
      number: 4,
      description: 'Daniela Soledade, Evandro Reis, João & more'
    },
    {
      id: 'daily-mix-5',
      title: 'Daily Mix 5',
      color: COLORS.gogo_green,
      number: 5,
      description: 'CHIBS, Superlate, Kaskade, berlioz & more'
    }
  ];

  // Top mixes data
  const topMixes = [
    {
      id: '70s-mix',
      title: '70s Mix',
      description: 'Earth, Wind & Fire, The Police, Dire Straits & more',
      coverImage: '/music/playlists/70s-mix.jpg'
    },
    {
      id: 'rock-mix',
      title: 'Rock Mix',
      description: 'Fleetwood Mac, America, Eagles & more',
      coverImage: '/music/playlists/rock-mix.jpg'
    },
    {
      id: 'jazz-mix',
      title: 'Jazz Mix',
      description: 'Piero Piccioni, Laufey, Jack Wilkins & more',
      coverImage: '/music/playlists/jazz-mix.jpg'
    },
    {
      id: 'happy-mix',
      title: 'Happy Mix',
      description: 'Gloria Gaynor, Bee Gees, Earth, Wind & more',
      coverImage: '/music/playlists/happy-mix.jpg'
    },
    {
      id: 'chill-mix',
      title: 'Chill Mix',
      description: 'Bobby Caldwell, Sade, Marc Johnson & more',
      coverImage: '/music/playlists/chill-mix.jpg'
    }
  ];

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const response = await fetch('/music/catalog.json');
        if (!response.ok) {
          throw new Error('Failed to load music catalog');
        }
        const data = await response.json();
        setCatalog(data);
      } catch (err) {
        console.error('Error loading music catalog:', err);
        setError('Could not load the music catalog. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();

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

  const handlePlayTrack = (track: CatalogTrack, albumCover: string) => {
    // Call the onPlayTrack prop to update the now playing bar
    onPlayTrack({
      id: track.id,
      title: track.title,
      artist: track.artist,
      cover: albumCover,
      duration: track.duration
    });
    
    // Continue to handle local audio player if needed
    if (audioRef.current) {
      // If the same track is clicked, toggle play/pause
      if (currentlyPlaying === track.file) {
        if (audioRef.current.paused) {
          audioRef.current.play();
        } else {
          audioRef.current.pause();
        }
      } else {
        // Play a new track
        audioRef.current.src = track.file;
        audioRef.current.play();
        setCurrentlyPlaying(track.file);
      }
    }
  };

  const handleAlbumSelect = (album: Album) => {
    setSelectedAlbum(album);
    
    // If there are tracks in the album, play the first one
    if (album.tracks && album.tracks.length > 0) {
      const firstTrack = album.tracks[0];
      onPlayTrack({
        id: firstTrack.id,
        title: firstTrack.title,
        artist: firstTrack.artist,
        cover: album.coverImage,
        duration: firstTrack.duration
      });
    }
    
    // Scroll to the album detail view
    setTimeout(() => {
      window.scrollTo({
        top: document.querySelector('#album-detail')?.getBoundingClientRect().top || 0,
        behavior: 'smooth'
      });
    }, 100);
  };

  if (loading) {
    return (
      <MusicLibraryContainer>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          Loading music catalog...
        </div>
      </MusicLibraryContainer>
    );
  }

  if (error) {
    return (
      <MusicLibraryContainer>
        <div style={{ textAlign: 'center', padding: '3rem', color: 'red' }}>
          {error}
        </div>
      </MusicLibraryContainer>
    );
  }

  if (!catalog || catalog.albums.length === 0) {
    return (
      <MusicLibraryContainer>
        <NoAlbumsMessage>No albums found in the music catalog.</NoAlbumsMessage>
      </MusicLibraryContainer>
    );
  }

  return (
    <MusicLibraryContainer>
      {/* Featured New Release - The Rain May Be Pouring */}
      {catalog.albums.find(album => album.id === 'the_rain_may_be_pouring') && (
        <FeaturedAlbumSection>
          <FeaturedAlbumCover 
            image={catalog.albums.find(album => album.id === 'the_rain_may_be_pouring')?.coverImage || ''}
            onClick={() => handleAlbumSelect(catalog.albums.find(album => album.id === 'the_rain_may_be_pouring')!)}
          />
          <FeaturedAlbumInfo>
            <FeaturedAlbumBadge>New Release</FeaturedAlbumBadge>
            <FeaturedAlbumTitle>The Rain May Be Pouring</FeaturedAlbumTitle>
            <FeaturedAlbumArtist>Guitars Over Guns</FeaturedAlbumArtist>
            <FeaturedAlbumDescription>
              An inspirational album created by GOGO students, featuring original compositions that share 
              their experiences through music. These tracks showcase the talents developed through the 
              Guitars Over Guns mentorship program.
            </FeaturedAlbumDescription>
            <FeaturedTrackList>
              {catalog.albums.find(album => album.id === 'the_rain_may_be_pouring')?.tracks.slice(0, 5).map(track => (
                <FeaturedTrack 
                  key={track.id}
                  onClick={() => handlePlayTrack(
                    track, 
                    catalog.albums.find(album => album.id === 'the_rain_may_be_pouring')?.coverImage || ''
                  )}
                >
                  <PlayIcon>▶</PlayIcon>
                  <FeaturedTrackTitle>{track.title}</FeaturedTrackTitle>
                  <FeaturedTrackDuration>{track.duration}</FeaturedTrackDuration>
                </FeaturedTrack>
              ))}
            </FeaturedTrackList>
          </FeaturedAlbumInfo>
        </FeaturedAlbumSection>
      )}

      {/* Made For You Section */}
      <PageSection>
        <SectionHeader>
          <SectionTitle>Made For Aaron Smolyar</SectionTitle>
          <SeeAllLink href="#">SHOW ALL</SeeAllLink>
        </SectionHeader>
        
        <DailyMixGrid>
          {dailyMixes.map((mix) => (
            <DailyMixCard key={mix.id}>
              <DailyMixCover color={mix.color} number={mix.number}>
                <PlayButton>▶</PlayButton>
              </DailyMixCover>
              <DailyMixTitle>{mix.title}</DailyMixTitle>
              <DailyMixDescription>{mix.description}</DailyMixDescription>
            </DailyMixCard>
          ))}
        </DailyMixGrid>
      </PageSection>

      {/* Your top mixes */}
      <PageSection>
        <SectionHeader>
          <SectionTitle>Your top mixes</SectionTitle>
          <SeeAllLink href="#">SHOW ALL</SeeAllLink>
        </SectionHeader>
        
        <CardGrid>
          {topMixes.map(mix => (
            <Card key={mix.id}>
              <CardCover url={mix.coverImage}>
                <PlayButton>▶</PlayButton>
              </CardCover>
              <CardTitle>{mix.title}</CardTitle>
              <CardDescription>{mix.description}</CardDescription>
            </Card>
          ))}
        </CardGrid>
      </PageSection>

      {/* GOGO Albums */}
      <PageSection>
        <SectionHeader>
          <SectionTitle>GOGO Music Collection</SectionTitle>
          <SeeAllLink href="#">SHOW ALL</SeeAllLink>
        </SectionHeader>
        
        <CardGrid>
          {catalog.albums.map((album) => (
            <Card key={album.id} onClick={() => handleAlbumSelect(album)}>
              <CardCover 
                url={album.coverImage}
                onError={(e: React.SyntheticEvent<HTMLDivElement, Event>) => {
                  const target = e.target as HTMLElement;
                  target.style.backgroundImage = `url('https://placehold.co/500x500/171717/b3b3b3?text=${album.title}')`;
                }}
              >
                <PlayButton>▶</PlayButton>
              </CardCover>
              <CardTitle>{album.title}</CardTitle>
              <CardDescription>{album.description}</CardDescription>
            </Card>
          ))}
        </CardGrid>
      </PageSection>

      {/* Album Detail View */}
      {selectedAlbum && (
        <AlbumDetailView id="album-detail">
          <AlbumHeader>
            <AlbumCoverLarge 
              url={selectedAlbum.coverImage}
              onError={(e: React.SyntheticEvent<HTMLDivElement, Event>) => {
                const target = e.target as HTMLElement;
                target.style.backgroundImage = `url('https://placehold.co/500x500/171717/b3b3b3?text=${selectedAlbum.title}')`;
              }}
            />
            <AlbumInfo>
              <AlbumType>Album</AlbumType>
              <AlbumTitleLarge>{selectedAlbum.title}</AlbumTitleLarge>
              <AlbumMetadata>
                <span>GOGO • {selectedAlbum.year} • {selectedAlbum.tracks.length} songs</span>
              </AlbumMetadata>
            </AlbumInfo>
          </AlbumHeader>

          <TrackList>
            <TrackHeader>
              <HeaderCell>#</HeaderCell>
              <HeaderCell>Title</HeaderCell>
              <HeaderCell>Duration</HeaderCell>
            </TrackHeader>
            
            {selectedAlbum.tracks.map((track, index) => (
              <TrackRow 
                key={track.id} 
                onClick={() => handlePlayTrack(track, selectedAlbum.coverImage)}
              >
                <TrackNumber>{currentlyPlaying === track.file ? '▶' : index + 1}</TrackNumber>
                <TrackDetails>
                  <TrackTitle>{track.title}</TrackTitle>
                  <TrackArtist>{track.artist}</TrackArtist>
                </TrackDetails>
                <TrackDuration>{track.duration}</TrackDuration>
              </TrackRow>
            ))}
          </TrackList>
        </AlbumDetailView>
      )}

      {/* Artist section */}
      <PageSection>
        <SectionHeader>
          <SectionTitle>GOGO Artists</SectionTitle>
          <SeeAllLink href="#">SHOW ALL</SeeAllLink>
        </SectionHeader>
        
        <CardGrid>
          <Card onClick={() => onArtistClick('caetano-veloso')}>
            <CardCover url="https://i.scdn.co/image/ab6761610000e5eb23960da5fab496188f9d5054">
              <PlayButton>▶</PlayButton>
            </CardCover>
            <CardTitle>Caetano Veloso</CardTitle>
            <CardDescription>Artist</CardDescription>
          </Card>
          <Card onClick={() => onArtistClick('gogo-students')}>
            <CardCover url="/music/artists/gogo_students.jpg">
              <PlayButton>▶</PlayButton>
            </CardCover>
            <CardTitle>GOGO Student Ensemble</CardTitle>
            <CardDescription>Artist</CardDescription>
          </Card>
          <Card onClick={() => onArtistClick('gogo-mentors')}>
            <CardCover url="/music/artists/gogo_mentors.jpg">
              <PlayButton>▶</PlayButton>
            </CardCover>
            <CardTitle>GOGO Mentor Collective</CardTitle>
            <CardDescription>Artist</CardDescription>
          </Card>
        </CardGrid>
      </PageSection>
    </MusicLibraryContainer>
  );
};

export default MusicLibrary;
