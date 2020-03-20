import db, { getSingleRow } from 'utils/db';
import moment from 'moment';
import { find } from 'lodash/collection';
import { has } from 'lodash/object';
import { isFunction, isString, isUndefined } from 'lodash/lang';
import { fetchMovieDetails } from 'utils/movies';
import generateId, { isValidId } from 'utils/generateId';
import { NotFoundError } from 'error';
import { BadRequestError } from '../error';

const fieldsToStore = {
  year: 'Year',
  rated: 'Rated',
  releaseDate: movie => {
    const releaseDate = movie.Released;
    return moment(releaseDate, 'DD MMM YYYY').valueOf();
  },
  runTime: 'RunTime',
  genre: movie => movie.Genre.split(', '),
  director: 'Director',
  writer: 'Writer',
  plot: 'Plot',
  imdbRating: movie => parseFloat(movie.imdbRating),
  rtRating: movie => {
    const rating = find(movie.Ratings, rating => rating.Source == 'Rotten Tomatoes');
    if (rating) {
      console.log(rating);
      return parseInt(rating.Value.match(/([0-9\.]+)%/)[1]);
    }

    return undefined;
  },
  mcRating: movie => parseInt(movie.Metascore)
};

const extractMovieDetails = movie => {
  return Object.keys(fieldsToStore).reduce((details, field) => {
    let value;
    const fieldConvert = fieldsToStore[field];
    if (isFunction(fieldConvert)) {
      value = fieldConvert(movie);
    } else if (isString(fieldConvert) && has(movie, fieldConvert)) {
      value = movie[fieldConvert];
    }

    if (!isUndefined(value)) {
      details[field] = value;
    }

    return details;
  }, {});
};

const getMovieByImdbId = async (imdbId) => {
  return getSingleRow(db.query(`SELECT id, title, imdb_id, image_url, data FROM movies WHERE imdb_id='${imdbId}'`));
}

export const getMovieById = async (imdbId) => {
  return getSingleRow(db.query(`SELECT * FROM movies WHERE id='${id}'`));
}

const getUserMovieByImdbId = async (imdbId) => {
  return getSingleRow(db.query(`SELECT * FROM user_movies WHERE movie_id=(SELECT id from movies WHERE imdb_id='${imdbId}')`));
};

export const addMovie = async ({ imdbId, user }) => {
  if (isUndefined(imdbId)) {
    throw new BadRequestError('Parameter \'imdbId\' is required');
  }

  const existingMovie = await getMovieByImdbId(imdbId);
  if (existingMovie) {
    console.log('Found existing movie', existingMovie);
    return existingMovie;
  }

  const movie = await fetchMovieDetails(imdbId);
  if (!movie) {
    throw new NotFoundError(`Unable to locate movie with imdbID: ${imdbId}`);
  }

  const { Title: title, Poster: imageUrl, imdbID } = movie;
  const data = extractMovieDetails(movie);
  const result = await db.query(
    'INSERT INTO movies (id, title, imdb_id, image_url, data, added_by)' + 
      ' VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, title, imdb_id, image_url, data',
    [generateId(), title, imdbID, imageUrl, data, user.id]
  );
  return result.rows[0];
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