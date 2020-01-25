import { createJwt, verifyJwt } from '../controller/auth';
import { getAndValidateUser } from '../controller/user';

const doLogin = router => router.post('/login', async (req, res, next) => {
  try {
    const user = await getAndValidateUser(req.body);
    const token = createJwt(user);
    return res.json(token);
  } catch (e) {
    return next(e);
  }
});

const doVerify = router => router.post('/verify', async (req, res, next) => {
  try {
    const decoded = verifyJwt(req.body.token);
    return res.json(decoded);
  } catch (e) {
    return next(e);
  }
});

export default {
  path: '/auth',
  routes: [
    doLogin,
    doVerify
  ],
  private: false
};
