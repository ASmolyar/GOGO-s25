import { Album, Artist, Song, MusicData } from '../types/music';

// Use undefined instead of null for better type safety
let musicData: MusicData | undefined;

/**
 * Loads the music data from the JSON file
 */
export async function loadMusicData(): Promise<MusicData> {
  if (musicData) {
    return musicData;
  }

  try {
    const response = await fetch('/music/catalog.json');
    if (!response.ok) {
      throw new Error('Failed to load album data');
    }

    const data = (await response.json()) as MusicData;
    musicData = data;
    return data;
  } catch (error) {
    console.error('Error loading music data:', error);
    // Return empty data as fallback
    return { albums: [] };
  }
}

/**
 * Gets all albums
 */
export async function getAlbums(): Promise<Album[]> {
  const data = await loadMusicData();
  return data.albums;
}

/**
 * Gets an album by ID
 */
export async function getAlbumById(id: string): Promise<Album | undefined> {
  const data = await loadMusicData();
  return data.albums.find((album) => album.album_id === id);
}

/**
 * Gets all songs from a specific album
 */
export async function getSongsByAlbumId(albumId: string): Promise<Song[]> {
  const album = await getAlbumById(albumId);
  return album ? album.songs : [];
}

/**
 * Gets a song by ID
 */
export async function getSongById(songId: string): Promise<Song | undefined> {
  const data = await loadMusicData();
  for (const album of data.albums) {
    const song = album.songs.find((s) => s.song_id === songId);
    if (song) return song;
  }
  return undefined;
}

/**
 * Gets all artists
 */
export async function getArtists(): Promise<Artist[]> {
  const data = await loadMusicData();
  const artistMap = new Map<string, Artist>();

  // Collect all unique artists
  data.albums.forEach((album) => {
    album.songs.forEach((song) => {
      song.artists.forEach((artist) => {
        artistMap.set(artist.artist_id, artist);
      });
    });
  });

  return Array.from(artistMap.values());
}

/**
 * Gets an artist by ID
 */
export async function getArtistById(
  artistId: string,
): Promise<Artist | undefined> {
  const artists = await getArtists();
  return artists.find((artist) => artist.artist_id === artistId);
}

/**
 * Gets all songs by a specific artist
 */
export async function getSongsByArtist(artistId: string): Promise<Song[]> {
  const data = await loadMusicData();
  const songs: Song[] = [];

  data.albums.forEach((album) => {
    album.songs.forEach((song) => {
      if (song.artists.some((artist) => artist.artist_id === artistId)) {
        songs.push(song);
      }
    });
  });

  return songs;
}

/**
 * Gets all albums a specific artist appears on
 */
export async function getAlbumsByArtist(artistId: string): Promise<Album[]> {
  const data = await loadMusicData();
  const albumSet = new Set<string>();
  const artistAlbums: Album[] = [];

  data.albums.forEach((album) => {
    album.songs.forEach((song) => {
      if (song.artists.some((artist) => artist.artist_id === artistId)) {
        if (!albumSet.has(album.album_id)) {
          albumSet.add(album.album_id);
          artistAlbums.push(album);
        }
      }
    });
  });

  return artistAlbums;
}
