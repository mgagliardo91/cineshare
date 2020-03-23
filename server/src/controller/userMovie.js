import { isUndefined, isEmpty } from 'lodash/lang';
import db, { getSingleRow } from 'utils/db';
import generateId  from 'utils/generateId';
import { addMovie } from './movie';
import { ValidationError } from '../error';

const movieJoinQuery = 'SELECT um.*, to_jsonb(m) AS movie FROM user_movies um'
  + ' INNER JOIN movies m'
  + ' ON m.id = um.movie_id';

const getUserMovie = async (id) => {
  return getSingleRow(db.query(`SELECT * FROM user_movie where id='${id}'`));
};

const getUserMovieByImdbId = async (userId, imdbId) => {
  return getSingleRow(db.query(`SELECT * FROM user_movies WHERE user_id='${userId}' AND movie_id=(SELECT id from movies WHERE imdb_id='${imdbId}')`));
};

const getUserMoviesByUserId = async (userId) => {
  const result = await db.query(`${movieJoinQuery} WHERE um.user_id='${userId}'`);
  return result.rows;
};


export const createUserMovie = async ({ imdbId, user }) => {
  const userMovie = await getUserMovieByImdbId(imdbId);
  if (userMovie) {
    return userMovie;
  }

  const movie = await addMovie({ imdbId, user });
  const result = await db.query(
    `INSERT INTO user_movies (id, user_id, movie_id) VALUES ($1, $2, $3) RETURNING *`,
    [generateId(), user.id, movie.id]
  );
  return result.rows[0];
};

export const getAllUserMovie = async (userId) => {
  return await getUserMoviesByUserId(userId);
};

const updateFields = [
  'rating',
  'seen',
  'wish_list'
];

export const updateUserMovie = async (userMovie) => {
  const { id } = userMovie;
  if (!id) {
    throw new ValidationError(`Field 'id' is required.`)
  }

  const persistedUserMovie = await getUserMoviesByUserId(id);
  if (!persistedUserMovie) {
    throw new Notification(`Unable to locate movie with id ${id}`);
  }

  const update = updateFields.reduce((acc, field) => {
    const newValue = userId[field];
    const existingValue = persistedUserMovie[field];

    if (!isUndefined(newValue) && newValue !== existingValue) {
      acc[field] = newValue;
    }

    return acc;
  }, {});

  if (!isEmpty(update)) {

  }
};