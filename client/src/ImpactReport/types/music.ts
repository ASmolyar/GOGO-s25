// Music data model types

export type AlbumType = 'single' | 'EP' | 'album' | 'mixtape' | 'podcast';

export interface Artist {
  artist_id: string;
  name: string;
  profile_picture?: string;
  spotify_link?: string;
}

export interface Song {
  song_id: string;
  title: string;
  audio_file: string;
  album_id: string;
  artists: Artist[];
  duration?: number; // Duration in seconds
}

export interface Album {
  album_id: string;
  name: string;
  album_url?: string;
  type: AlbumType;
  artists: Artist[];
  cover: string;
  songs: Song[];
  date: string | Date;
  release_date?: string; // For backward compatibility
}

export interface MusicData {
  albums: Album[];
}
