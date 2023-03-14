/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('albums', {
    cover: {
      type: 'VARCHAR(100)',
      notNull: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('albums', ['coverUrl']);
};
