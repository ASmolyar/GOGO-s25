import React, { useState, useRef } from 'react';
import {
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
  Paper,
  Box,
  Divider,
  IconButton,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { v4 as uuidv4 } from 'uuid';
import ScreenGrid from '../components/ScreenGrid.tsx';
import COLORS from '../assets/colors.ts';
import { AlbumType } from '../ImpactReport/types/music.ts';

// Artist form type
interface ArtistForm {
  tempId: string;
  artist_id: string;
  name: string;
}

// Song form type
interface SongForm {
  tempId: string;
  song_id: string;
  title: string;
  audio_file: File | null;
  artists: ArtistForm[];
}

// Album form type
interface AlbumForm {
  album_id: string;
  name: string;
  album_url: string;
  type: AlbumType;
  cover: File | null;
  date: string;
  artists: ArtistForm[];
  songs: SongForm[];
}

/**
 * A page for uploading new albums to the music section
 */
function AlbumUploadPage() {
  // Album form state with default values
  const [albumForm, setAlbumForm] = useState<AlbumForm>({
    album_id: uuidv4(),
    name: '',
    album_url: '',
    type: 'album',
    cover: null,
    date: new Date().toISOString().split('T')[0],
    artists: [{ tempId: uuidv4(), artist_id: uuidv4(), name: '' }],
    songs: [],
  });

  // Cover image preview
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  // Error states
  const [errors, setErrors] = useState<{
    name: string;
    cover: string;
    artists: string;
    songs: string;
    general: string;
  }>({
    name: '',
    cover: '',
    artists: '',
    songs: '',
    general: '',
  });

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs for file inputs
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Handle album form changes
  const handleAlbumChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setAlbumForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear related error
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Handle album type change
  const handleAlbumTypeChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setAlbumForm((prev) => ({
      ...prev,
      type: e.target.value as AlbumType,
    }));
  };

  // Handle artist changes
  const handleArtistChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    const updatedArtists = [...albumForm.artists];
    updatedArtists[index] = {
      ...updatedArtists[index],
      [name]: value,
    };

    setAlbumForm((prev) => ({
      ...prev,
      artists: updatedArtists,
    }));

    // Clear artists error if needed
    if (errors.artists && value.trim()) {
      setErrors((prev) => ({
        ...prev,
        artists: '',
      }));
    }
  };

  // Add artist
  const handleAddArtist = () => {
    setAlbumForm((prev) => ({
      ...prev,
      artists: [
        ...prev.artists,
        { tempId: uuidv4(), artist_id: uuidv4(), name: '' },
      ],
    }));
  };

  // Remove artist
  const handleRemoveArtist = (index: number) => {
    if (albumForm.artists.length <= 1) {
      setErrors((prev) => ({
        ...prev,
        artists: 'At least one artist is required',
      }));
      return;
    }

    const updatedArtists = [...albumForm.artists];
    updatedArtists.splice(index, 1);

    setAlbumForm((prev) => ({
      ...prev,
      artists: updatedArtists,
    }));
  };

  // Handle song changes
  const handleSongChange = (
    songIndex: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    const updatedSongs = [...albumForm.songs];
    updatedSongs[songIndex] = {
      ...updatedSongs[songIndex],
      [name]: value,
    };

    setAlbumForm((prev) => ({
      ...prev,
      songs: updatedSongs,
    }));

    // Clear songs error if needed
    if (errors.songs && value.trim()) {
      setErrors((prev) => ({
        ...prev,
        songs: '',
      }));
    }
  };

  // Add song
  const handleAddSong = () => {
    setAlbumForm((prev) => ({
      ...prev,
      songs: [
        ...prev.songs,
        {
          tempId: uuidv4(),
          song_id: uuidv4(),
          title: '',
          audio_file: null,
          artists: [...prev.artists], // Default to all album artists
        },
      ],
    }));
  };

  // Remove song
  const handleRemoveSong = (index: number) => {
    const updatedSongs = [...albumForm.songs];
    updatedSongs.splice(index, 1);

    setAlbumForm((prev) => ({
      ...prev,
      songs: updatedSongs,
    }));
  };

  // Handle song artist changes
  const handleSongArtistChange = (
    songIndex: number,
    artistIndex: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    const updatedSongs = [...albumForm.songs];
    const updatedArtists = [...updatedSongs[songIndex].artists];

    updatedArtists[artistIndex] = {
      ...updatedArtists[artistIndex],
      [name]: value,
    };

    updatedSongs[songIndex] = {
      ...updatedSongs[songIndex],
      artists: updatedArtists,
    };

    setAlbumForm((prev) => ({
      ...prev,
      songs: updatedSongs,
    }));
  };

  // Add artist to song
  const handleAddSongArtist = (songIndex: number) => {
    const updatedSongs = [...albumForm.songs];
    updatedSongs[songIndex] = {
      ...updatedSongs[songIndex],
      artists: [
        ...updatedSongs[songIndex].artists,
        { tempId: uuidv4(), artist_id: uuidv4(), name: '' },
      ],
    };

    setAlbumForm((prev) => ({
      ...prev,
      songs: updatedSongs,
    }));
  };

  // Remove artist from song
  const handleRemoveSongArtist = (songIndex: number, artistIndex: number) => {
    if (albumForm.songs[songIndex].artists.length <= 1) {
      return; // Don't remove the last artist
    }

    const updatedSongs = [...albumForm.songs];
    const updatedArtists = [...updatedSongs[songIndex].artists];
    updatedArtists.splice(artistIndex, 1);

    updatedSongs[songIndex] = {
      ...updatedSongs[songIndex],
      artists: updatedArtists,
    };

    setAlbumForm((prev) => ({
      ...prev,
      songs: updatedSongs,
    }));
  };

  // Handle cover image upload
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAlbumForm((prev) => ({
        ...prev,
        cover: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        setCoverPreview(readerEvent.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Clear cover error
      setErrors((prev) => ({
        ...prev,
        cover: '',
      }));
    }
  };

  // Handle audio file upload
  const handleAudioUpload = (
    songIndex: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const updatedSongs = [...albumForm.songs];
      updatedSongs[songIndex] = {
        ...updatedSongs[songIndex],
        audio_file: file,
      };

      setAlbumForm((prev) => ({
        ...prev,
        songs: updatedSongs,
      }));
    }
  };

  // Validate the form
  const validateForm = (): boolean => {
    const newErrors = {
      name: '',
      cover: '',
      artists: '',
      songs: '',
      general: '',
    };

    let isValid = true;

    // Check album name
    if (!albumForm.name.trim()) {
      newErrors.name = 'Album name is required';
      isValid = false;
    }

    // Check cover image
    if (!albumForm.cover) {
      newErrors.cover = 'Album cover is required';
      isValid = false;
    }

    // Check artists
    if (albumForm.artists.length === 0) {
      newErrors.artists = 'At least one artist is required';
      isValid = false;
    } else {
      // Check if any artist name is empty
      const hasEmptyArtist = albumForm.artists.some(
        (artist) => !artist.name.trim(),
      );
      if (hasEmptyArtist) {
        newErrors.artists = 'All artist names are required';
        isValid = false;
      }
    }

    // Check songs
    if (albumForm.songs.length === 0) {
      newErrors.songs = 'At least one song is required';
      isValid = false;
    } else {
      // Check if any song has empty title or missing audio file
      const hasInvalidSong = albumForm.songs.some(
        (song) => !song.title.trim() || !song.audio_file,
      );
      if (hasInvalidSong) {
        newErrors.songs = 'All songs must have a title and audio file';
        isValid = false;
      }

      // Check if any song has empty artist name
      const hasEmptySongArtist = albumForm.songs.some((song) =>
        song.artists.some((artist) => !artist.name.trim()),
      );
      if (hasEmptySongArtist) {
        newErrors.songs = 'All song artists must have a name';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData to handle file uploads
      const formData = new FormData();

      // Add album basic details
      formData.append('album_id', albumForm.album_id);
      formData.append('name', albumForm.name);
      formData.append('album_url', albumForm.album_url);
      formData.append('type', albumForm.type);
      formData.append('date', albumForm.date);

      // Add cover image
      if (albumForm.cover) {
        formData.append('cover', albumForm.cover);
      }

      // Add album artists
      formData.append('artists', JSON.stringify(albumForm.artists));

      // Add songs
      const songsData = albumForm.songs.map((song) => ({
        song_id: song.song_id,
        title: song.title,
        album_id: albumForm.album_id,
        artists: song.artists,
      }));
      formData.append('songs', JSON.stringify(songsData));

      // Add song audio files
      albumForm.songs.forEach((song, index) => {
        if (song.audio_file) {
          formData.append(`audio_${song.song_id}`, song.audio_file);
        }
      });

      // Here you would make an API call to upload the album
      // For now we'll just log the form data
      console.log('Album data:', Object.fromEntries(formData.entries()));
      console.log('Raw album form data:', albumForm);

      // Show success message (in a real app, this would be after API response)
      alert('Album uploaded successfully!');

      // Reset form
      setAlbumForm({
        album_id: uuidv4(),
        name: '',
        album_url: '',
        type: 'album',
        cover: null,
        date: new Date().toISOString().split('T')[0],
        artists: [{ tempId: uuidv4(), artist_id: uuidv4(), name: '' }],
        songs: [],
      });
      setCoverPreview(null);
    } catch (error) {
      console.error('Error uploading album:', error);
      setErrors((prev) => ({
        ...prev,
        general:
          'An error occurred while uploading the album. Please try again.',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenGrid>
      <Grid item>
        <Typography variant="h2" color="white">
          Upload New Album
        </Typography>
        <Typography variant="subtitle1" color="white" sx={{ mt: 1, mb: 3 }}>
          Add a new album to the music library
        </Typography>
      </Grid>

      <Grid
        item
        container
        spacing={3}
        sx={{ maxWidth: 1200, margin: '0 auto' }}
      >
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          {/* General album information */}
          <Paper sx={{ p: 3, mb: 4, bgcolor: '#121212', color: 'white' }}>
            <Typography variant="h5" gutterBottom>
              Album Information
            </Typography>
            <Divider sx={{ mb: 3, bgcolor: 'rgba(255,255,255,0.1)' }} />

            <Grid container spacing={3}>
              {/* Album title */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Album Name"
                  name="name"
                  value={albumForm.name}
                  onChange={handleAlbumChange}
                  fullWidth
                  required
                  error={!!errors.name}
                  helperText={errors.name}
                  InputLabelProps={{ style: { color: 'white' } }}
                  InputProps={{ style: { color: 'white' } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                    },
                  }}
                />
              </Grid>

              {/* Album type */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel id="album-type-label" sx={{ color: 'white' }}>
                    Album Type
                  </InputLabel>
                  <Select
                    labelId="album-type-label"
                    id="album-type"
                    value={albumForm.type}
                    label="Album Type"
                    onChange={(e) => handleAlbumTypeChange(e as any)}
                    sx={{
                      color: 'white',
                      '.MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                    }}
                  >
                    <MenuItem value="single">Single</MenuItem>
                    <MenuItem value="EP">EP</MenuItem>
                    <MenuItem value="album">Album</MenuItem>
                    <MenuItem value="mixtape">Mixtape</MenuItem>
                    <MenuItem value="podcast">Podcast</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Album URL */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Album URL (optional)"
                  name="album_url"
                  value={albumForm.album_url}
                  onChange={handleAlbumChange}
                  fullWidth
                  placeholder="e.g., https://open.spotify.com/album/..."
                  InputLabelProps={{ style: { color: 'white' } }}
                  InputProps={{ style: { color: 'white' } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                    },
                  }}
                />
              </Grid>

              {/* Release date */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Release Date"
                  name="date"
                  type="date"
                  value={albumForm.date}
                  onChange={handleAlbumChange}
                  fullWidth
                  required
                  InputLabelProps={{
                    shrink: true,
                    style: { color: 'white' },
                  }}
                  InputProps={{ style: { color: 'white' } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                    },
                  }}
                />
              </Grid>

              {/* Album cover */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Album Cover (Required)
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: 'center',
                    gap: 3,
                  }}
                >
                  {/* Cover preview */}
                  <Box
                    sx={{
                      width: 200,
                      height: 200,
                      border: coverPreview
                        ? 'none'
                        : '2px dashed rgba(255,255,255,0.3)',
                      borderRadius: 1,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      overflow: 'hidden',
                      bgcolor: coverPreview ? 'transparent' : 'rgba(0,0,0,0.2)',
                    }}
                  >
                    {coverPreview ? (
                      <img
                        src={coverPreview}
                        alt="Album cover preview"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <Typography variant="body2" color="rgba(255,255,255,0.5)">
                        No cover uploaded
                      </Typography>
                    )}
                  </Box>

                  <Box>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      style={{ display: 'none' }}
                      ref={coverInputRef}
                    />
                    <Button
                      variant="outlined"
                      startIcon={<CloudUploadIcon />}
                      onClick={() => coverInputRef.current?.click()}
                      sx={{ mb: 1 }}
                    >
                      Upload Cover
                    </Button>

                    <Typography
                      variant="caption"
                      display="block"
                      color="rgba(255,255,255,0.6)"
                    >
                      Recommended size: 500x500px, JPG or PNG format
                    </Typography>

                    {errors.cover && (
                      <Typography variant="caption" color="error">
                        {errors.cover}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Album artists */}
          <Paper sx={{ p: 3, mb: 4, bgcolor: '#121212', color: 'white' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant="h5">Album Artists</Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddArtist}
                variant="outlined"
                size="small"
              >
                Add Artist
              </Button>
            </Box>
            <Divider sx={{ mb: 3, bgcolor: 'rgba(255,255,255,0.1)' }} />

            {errors.artists && (
              <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                {errors.artists}
              </Typography>
            )}

            {albumForm.artists.map((artist, index) => (
              <Grid container spacing={2} key={artist.tempId} sx={{ mb: 2 }}>
                <Grid item xs={10}>
                  <TextField
                    label="Artist Name"
                    name="name"
                    value={artist.name}
                    onChange={(e) =>
                      handleArtistChange(
                        index,
                        e as React.ChangeEvent<HTMLInputElement>,
                      )
                    }
                    fullWidth
                    required
                    InputLabelProps={{ style: { color: 'white' } }}
                    InputProps={{ style: { color: 'white' } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.5)',
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton
                    onClick={() => handleRemoveArtist(index)}
                    disabled={albumForm.artists.length <= 1}
                    sx={{ color: 'rgba(255,255,255,0.7)' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
          </Paper>

          {/* Songs */}
          <Paper sx={{ p: 3, mb: 4, bgcolor: '#121212', color: 'white' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant="h5">Songs</Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddSong}
                variant="outlined"
                size="small"
              >
                Add Song
              </Button>
            </Box>
            <Divider sx={{ mb: 3, bgcolor: 'rgba(255,255,255,0.1)' }} />

            {errors.songs && (
              <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                {errors.songs}
              </Typography>
            )}

            {albumForm.songs.length === 0 ? (
              <Typography
                variant="body2"
                color="rgba(255,255,255,0.6)"
                align="center"
                sx={{ py: 4 }}
              >
                No songs added yet. Click &quot;Add Song&quot; to add songs to
                this album.
              </Typography>
            ) : (
              albumForm.songs.map((song, songIndex) => (
                <Paper
                  key={song.tempId}
                  sx={{ p: 2, mb: 3, bgcolor: 'rgba(255,255,255,0.05)' }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6">Song {songIndex + 1}</Typography>
                    <IconButton
                      onClick={() => handleRemoveSong(songIndex)}
                      sx={{ color: 'rgba(255,255,255,0.7)' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  <Grid container spacing={2}>
                    {/* Song title */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Song Title"
                        name="title"
                        value={song.title}
                        onChange={(e) =>
                          handleSongChange(
                            songIndex,
                            e as React.ChangeEvent<HTMLInputElement>,
                          )
                        }
                        fullWidth
                        required
                        InputLabelProps={{ style: { color: 'white' } }}
                        InputProps={{ style: { color: 'white' } }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.3)',
                            },
                            '&:hover fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.5)',
                            },
                          },
                        }}
                      />
                    </Grid>

                    {/* Audio file upload */}
                    <Grid item xs={12} md={6}>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) => handleAudioUpload(songIndex, e)}
                        style={{ display: 'none' }}
                        id={`song-audio-${song.tempId}`}
                      />
                      <label htmlFor={`song-audio-${song.tempId}`}>
                        <Button
                          variant="outlined"
                          component="span"
                          startIcon={<CloudUploadIcon />}
                          fullWidth
                          sx={{ height: '56px' }}
                        >
                          {song.audio_file
                            ? song.audio_file.name
                            : 'Upload MP3 File'}
                        </Button>
                      </label>
                    </Grid>

                    {/* Song artists */}
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 1,
                        }}
                      >
                        <Typography variant="subtitle2">
                          Song Artists
                        </Typography>
                        <Button
                          size="small"
                          startIcon={<AddIcon />}
                          onClick={() => handleAddSongArtist(songIndex)}
                        >
                          Add Artist
                        </Button>
                      </Box>

                      {song.artists.map((artist, artistIndex) => (
                        <Grid
                          container
                          spacing={2}
                          key={artist.tempId}
                          sx={{ mb: 1 }}
                        >
                          <Grid item xs={10}>
                            <TextField
                              label={`Artist ${artistIndex + 1}`}
                              name="name"
                              value={artist.name}
                              onChange={(e) =>
                                handleSongArtistChange(
                                  songIndex,
                                  artistIndex,
                                  e as React.ChangeEvent<HTMLInputElement>,
                                )
                              }
                              fullWidth
                              required
                              size="small"
                              InputLabelProps={{ style: { color: 'white' } }}
                              InputProps={{ style: { color: 'white' } }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '& fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                  },
                                  '&:hover fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.5)',
                                  },
                                },
                              }}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <IconButton
                              onClick={() =>
                                handleRemoveSongArtist(songIndex, artistIndex)
                              }
                              disabled={song.artists.length <= 1}
                              size="small"
                              sx={{ color: 'rgba(255,255,255,0.7)' }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                </Paper>
              ))
            )}
          </Paper>

          {/* Form actions */}
          <Box
            sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}
          >
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={isSubmitting}
              size="large"
              sx={{
                minWidth: 150,
                bgcolor: COLORS.gogo_blue,
                '&:hover': {
                  bgcolor: '#0066cc',
                },
              }}
            >
              {isSubmitting ? 'Uploading...' : 'Upload Album'}
            </Button>

            <Button
              variant="outlined"
              size="large"
              sx={{ minWidth: 100 }}
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
          </Box>

          {/* General error */}
          {errors.general && (
            <Typography variant="body2" color="error" align="center">
              {errors.general}
            </Typography>
          )}
        </form>
      </Grid>
    </ScreenGrid>
  );
}

export default AlbumUploadPage;
