import { createUserMovie } from 'controller/movie';

const doAddMovie = router => router.post('/', async (req, res, next) => {
  try {
    const movie = await createUserMovie({ user: req.user, ...req.body });
    return res.json(movie);
  } catch (e) {
    return next(e);
  }
});


export default {
  path: '/movie',
  routes: [
    doAddMovie
  ]
};
