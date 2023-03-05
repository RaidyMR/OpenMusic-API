/* eslint-disable camelcase */

const MapDBToModelSong = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
  inserted_at,
  updated_at,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id,
  insertedAt: inserted_at,
  updatedAt: updated_at,
});

const MapDBToModelAlbum = ({
  id,
  name,
  year,
  inserted_at,
  updated_at,
}) => ({
  id,
  name,
  year,
  insertedAt: inserted_at,
  updatedAt: updated_at,
});

module.exports = { MapDBToModelSong, MapDBToModelAlbum };
