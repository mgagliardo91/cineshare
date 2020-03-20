import { createJwt } from 'controller/auth';
import { createUser, getAndValidateUser } from 'controller/user';

const doLogin = router => router.post('/login', async (req, res, next) => {
  try {
    const user = await getAndValidateUser(req.body);
    const token = createJwt(user);
    return res.json(token);
  } catch (e) {
    return next(e);
  }
});

const doSignUp = router => router.post('/signup', async (req, res, next) => {
  try {
    const user = await createUser(req.body);
    return res.json(createJwt(user));
  } catch (e) {
    return next(e);
  }
});

export default {
  path: '/auth',
  routes: [
    doLogin,
    doSignUp
  ],
  private: false
};
