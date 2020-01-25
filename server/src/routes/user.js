import { createUser, getUser } from '../controller/user';

const doGet = router => router.get('/', async (req, res, next) => {
  try {
    const user = await getUser(req.user);
    return res.json(user);
  } catch (error) {
    return next(error);
  }
});

const doCreate = router => router.post('/', async (req, res, next) => {
  try {
    await createUser({ ...req.body });
    return res.json({ status: 'OK '});
  } catch (error) {
    return next(error);
  }
});

const doValidate = router => router.post('/validate', async (req, res, next) => {
  try {
    await getAndValidateUser({ ...req.body });
    return res.json({ status: 'OK '});
  } catch (error) {
    return next(error);
  }
});

export default {
  path: '/user',
  routes: [
    doGet,
    doCreate,
    doValidate
  ]
};