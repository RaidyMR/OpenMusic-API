const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
  constructor(collaborationService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylists(user) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username FROM playlists 
      LEFT JOIN users ON playlists.owner = users.id 
      WHERE playlists.owner = $1
      OR playlists.id IN (SELECT playlist_id FROM collaborations WHERE user_id = $1)
      `,
      values: [user],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id, owner',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  async addSongToPlaylist(playlistId, songId) {
    try {
      const query = {
        text: 'INSERT INTO playlistsongs (playlist_id, song_id) VALUES($1, $2) RETURNING id',
        values: [playlistId, songId],
      };

      const result = await this._pool.query(query);

      if (!result.rows[0].id) {
        throw new InvariantError('Lagu gagal ditambahkan ke playlist');
      }
    } catch (error) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
  }

  async getSongsFromPlaylist(playlistId) {
    const queryPlaylist = {
      text: `SELECT playlists.id, playlists.name, users.username FROM playlists 
      LEFT JOIN users ON playlists.owner = users.id 
      WHERE playlists.id = $1`,
      values: [playlistId],
    };
    const resultPlaylist = await this._pool.query(queryPlaylist);

    const querySong = {
      text: `SELECT songs.id, songs.title, songs.performer FROM playlistsongs
      FULL OUTER JOIN songs ON playlistsongs.song_id = songs.id
      WHERE playlistsongs.playlist_id = $1`,
      values: [playlistId],
    };
    const resultSong = await this._pool.query(querySong);

    if (!resultPlaylist.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    resultPlaylist.rows[0].songs = resultSong.rows;

    return resultPlaylist.rows[0];
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Lagu gagal dihapus');
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }

  async getUsersByUsername(username) {
    const query = {
      text: 'SELECT id, username, fullname FROM users WHERE username LIKE $1',
      values: [`%${username}%`],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = PlaylistsService;