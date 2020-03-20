/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('users', {
    id: {
      type: 'varchar(14)',
      notNull: true,
      primaryKey: true
    },
    email: {
      type: 'varchar(255)',
      notNull: true,
      unique: true
    },
    password: {
      type: 'varchar(60)',
      notNull: true
    },
    display_name: {
      type: 'varchar(40)'
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  });
  pgm.createTable('movies', {
    id: {
      type: 'varchar(14)',
      notNull: true,
      primaryKey: true
    },
    title: {
      type: 'varchar(80)',
      notNull: true
    },
    imdb_id: {
      type: 'varchar(14)',
      notNull: true,
      unique: true
    },
    image_url: {
      type: 'varchar(1048)'
    },
    data: {
      type: 'jsonb',
      notNull: true
    },
    added_by: {
      type: 'varchar(14)',
      notNull: true,
      references: '"users"'
    }
  });
  pgm.createTable('user_movies', {
    id: {
      type: 'varchar(14)',
      notNull: true,
      primaryKey: true
    },
    user_id: {
      type: 'varchar(14)',
      notNull: true,
      references: '"users"',
      onDelete: 'cascade'
    },
    movie_id: {
      type: 'varchar(14)',
      notNull: true,
      references: '"movies"'
    },
    rating: {
      type: 'numeric'
    },
    seen: {
      type: 'bool',
      default: 'false',
      notNull: true
    },
    wish_list: {
      type: 'bool',
      default: 'false',
      notNull: true
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  });
};

exports.down = pgm => {};
