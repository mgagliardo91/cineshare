import { createUserMovie, getAllUserMovie } from '../controller/userMovie';
import { validateUser } from '../controller/user';

const createUserRoute = route => `/:userId${route}`;

const doAddMovie = router => router.post(createUserRoute('/movies'), async (req, res, next) => {
  try {
    validateUser(req);
    const movie = await createUserMovie({ user: req.user, ...req.body });
    return res.json(movie);
  } catch (e) {
    return next(e);
  }
});

const getMovies = router => router.get(createUserRoute('/movies'), async (req, res, next) => {
  try {
    return res.json(await getAllUserMovie(req.params.userId));
  } catch (e) {
    return next(e);
  }
});

const updateMovie = router => router.put(createUserRoute('/movies'), async (req, res, next) => {
  try {

  } catch (e) {
    return next(e);
  }
});

export default {
  path: '/users',
  routes: [
    doAddMovie,
    getMovies
  ]
};
