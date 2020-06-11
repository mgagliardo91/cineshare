import { addMovie } from './movie';
import { NotFoundError } from 'error';
import { UserMovie } from 'model';

const updateFields = [
  'rating',
  'seen',
  'wish_list'
];

export const createUserMovie = async ({ user, imdbId }) => {
  let userMovie = await UserMovie.findByUserIdAndImdbId(user.id, imdbId);
  if (userMovie) {
    return userMovie;
  }

  const movie = await addMovie({ imdbId, user });
  userMovie = await UserMovie.create({});
  await userMovie.setMovie(movie);
  await userMovie.setUser(user);

  return UserMovie.findByUserIdAndId(user.Id, userMovie.id);
};

export const getAllUserMovie = async (userId) => {
  return await UserMovie.findAllByUserId(userId);
};

export const getUserMovie = async ({ user, userMovieId }) => {
  const userMovie = await UserMovie.findByUserIdAndId(user.id, userMovieId);
  if (!userMovie) {
    throw new NotFoundError(`Unable to locate UserMovie with id ${userMovieId}`);
  }
}

export const updateUserMovie = async ({ user, userMovieId, update }) => {
  const persistedUserMovie = await UserMovie.findByUserIdAndId(user.id, userMovieId);
  if (!persistedUserMovie) {
    throw new NotFoundError(`Unable to locate movie with id ${userMovieId}`);
  }

  updateFields.forEach((field) => {
    persistedUserMovie[field] = update[field];
  });

  await persistedUserMovie.save();
  return persistedUserMovie;
};

export const deleteUserMovie = async ({ user, userMovieId, update }) => {
  const persistedUserMovie = await UserMovie.findByUserIdAndId(user.id, userMovieId);
  if (!persistedUserMovie) {
    throw new NotFoundError(`Unable to locate movie with id ${userMovieId}`);
  }

  await persistedUserMovie.destroy();
  return { userMovieId };
};