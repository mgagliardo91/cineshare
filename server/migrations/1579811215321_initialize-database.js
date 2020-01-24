/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('users', {
    id: 'id',
    email: {
      type : 'varchar(255)',
      notNull: true
    },
    password: {
      type: 'varchar(60)',
      notNull: true
    },
    display_name: {
      type: 'varchar(40)'
    },
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  });
};

exports.down = pgm => {};
