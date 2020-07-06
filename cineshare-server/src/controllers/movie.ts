import moment from "moment";
import { fetchMovieDetails } from "../utils/movies";
import { Models } from "../models";
import { NotFoundError } from "../error/NotFoundError";

type RawMovie = { [key: string]: any };
type RawRating = { Source: string; Value: string };
type MovieConverter = (movie: RawMovie) => any | any[];
type FieldConverter = { [key: string]: any | any[] | MovieConverter };

const fieldsToStore: FieldConverter = {
  year: "Year",
  rated: "Rated",
  releaseDate: (movie: RawMovie) => {
    const releaseDate = movie.Released;
    const val = moment(releaseDate, "DD MMM YYYY");
    return val.toDate();
  },
  runTime: (movie: RawMovie) => {
    const runTime = movie.Runtime;
    return parseInt(runTime);
  },
  genre: (movie: RawMovie) => movie.Genre.split(", "),
  director: "Director",
  writer: "Writer",
  plot: "Plot",
  imdbRating: (movie: RawMovie) => parseFloat(movie.imdbRating),
  rtRating: (movie: RawMovie) => {
    const rating = movie.Ratings.find(
      (rating: RawRating) => rating.Source == "Rotten Tomatoes"
    );
    if (rating) {
      return parseInt(rating.Value.match(/([0-9\.]+)%/)[1]);
    }

    return undefined;
  },
  mcRating: (movie: RawMovie) => parseInt(movie.Metascore),
};

export const extractMovieDetails = (movie: RawMovie) => {
  return Object.keys(fieldsToStore).reduce((details: any, field) => {
    let value;
    const fieldConvert = fieldsToStore[field];
    if (typeof fieldConvert === "function") {
      value = fieldConvert(movie);
    } else if (typeof fieldConvert === "string" && fieldConvert in movie) {
      value = movie[fieldConvert];
    }

    if (typeof value !== "undefined") {
      details[field] = value;
    }

    return details;
  }, {});
};

export const findOrCreateMovie = async (imdbId: string, models: Models) => {
  const localMovie = await models.Movie.findByImdbId(imdbId);
  if (localMovie) {
    return localMovie;
  }

  const movieDetails = await fetchMovieDetails(imdbId);
  if (!movieDetails) {
    throw new NotFoundError(`Unable to locate movie with imdbId ${imdbId}`);
  }

  const { Title: title, Poster: imageUrl } = movieDetails;
  const data = extractMovieDetails(movieDetails);
  const result = await models.Movie.create({
    title,
    imdbId,
    imageUrl,
    data,
  });

  return result;
};
