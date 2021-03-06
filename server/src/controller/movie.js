import moment from 'moment';
import { find } from 'lodash/collection';
import { has } from 'lodash/object';
import { isFunction, isString, isUndefined } from 'lodash/lang';
import { fetchMovieDetails } from 'utils/movies';
import { NotFoundError, BadRequestError } from 'error';
import { Movie } from 'model';

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


export const addMovie = async ({ imdbId, user }) => {
  if (isUndefined(imdbId)) {
    throw new BadRequestError('Parameter \'imdbId\' is required');
  }

  const existingMovie = await Movie.findByImdbId(imdbId);
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
  const result = await Movie.create({
    title,
    imdbId,
    imageUrl,
    data
  });
  return result;
};
