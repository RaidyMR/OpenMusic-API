/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  //   create new albums row
  pgm.sql("INSERT INTO albums(id, name, year, inserted_at, updated_at) VALUES ('old_songs', 'old_songs', '0', 'old_songs', 'old_songs')");

  //   update songs album_id
  pgm.sql("UPDATE songs SET album_id = 'old_songs' WHERE album_id IS NULL");

  //   add constraint foreign key
  pgm.addConstraint('songs', 'fk_songs.album_id_albums.id', 'FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  // menghapus constraint fk_notes.owner_users.id pada tabel songs
  pgm.dropConstraint('songs', 'fk_songs.album_id_albums.id');

  // mengubah nilai owner old_notes pada note menjadi NULL
  pgm.sql("UPDATE songs SET album_id = NULL WHERE album_id = 'old_songs'");

  // menghapus album baru.
  pgm.sql("DELETE FROM albums WHERE id = 'old_songs'");
};
