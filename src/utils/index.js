/* eslint-disable camelcase */

const MapDBToModel = ({
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

module.exports = MapDBToModel;
