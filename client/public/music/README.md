# GOGO Music Collection

This folder contains all music files used in the GOGO Impact Report. The structure is organized by albums, allowing for easy management of different collections of songs.

## Folder Structure

```
music/
│
├── albums/
│   ├── student_performances/
│   │   ├── cover.jpg
│   │   ├── urban_rhythms.mp3
│   │   ├── rise_up.mp3
│   │   └── dreams.mp3
│   │
│   ├── mentor_showcase/
│   │   ├── cover.jpg
│   │   ├── inspire.mp3
│   │   ├── pathways.mp3
│   │   └── breakthrough.mp3
│   │
│   └── collaborative_works/
│       ├── cover.jpg
│       ├── harmony.mp3
│       ├── bridges.mp3
│       └── future.mp3
│
└── catalog.json
```

## How to Add a New Album

1. Create a new folder under `albums/` with a suitable name (use snake_case for consistency)
2. Add a cover image named `cover.jpg` in the album folder
3. Add the MP3 files to the album folder
4. Update the `catalog.json` file with the new album information

## How to Add Tracks to an Existing Album

1. Add the MP3 file to the appropriate album folder
2. Update the `catalog.json` file by adding a new track entry to the album's tracks array

## File Formats

- Album cover images: JPG format, recommended size 500x500px
- Audio files: MP3 format, high quality (at least 192kbps)

## Catalog.json Structure

The `catalog.json` file maintains metadata for all albums and tracks. Each album includes:

- `id`: Unique identifier matching the folder name
- `title`: Display title for the album
- `description`: Brief description of the album
- `coverImage`: Path to the album cover image
- `year`: Release year
- `tracks`: Array of track objects, each containing:
  - `id`: Unique identifier for the track
  - `title`: Display title for the track
  - `artist`: Artist or group name
  - `duration`: Track length in mm:ss format
  - `file`: Path to the MP3 file

## Integration with the Impact Report

This music library is used in the Impact Report to showcase student and mentor performances. The audio player components in the application will reference these files through the catalog.json metadata.
