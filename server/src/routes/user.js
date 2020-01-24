import bcrypt from 'bcrypt';
import db from '../db';
import { ValidationError } from '../error';

const saltRounds = 10;
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const createUser = async ({ email, password, displayName }) => {
  if (!emailRegex.test(email)) {
    throw new ValidationError(`Invalid email address: ${email}`);
  }

  const hash = await bcrypt.hash(password, saltRounds);
  console.log(`Creating user with values`, {
    email,
    password: hash,
    displayName
  });
  const result = await db.query('INSERT INTO users (email, password, display_name) VALUES ($1, $2, $3)', [email, hash, displayName]);
  console.log(result);
};

const validateUser = async ({ email, password }) => {
  if (!emailRegex.test(email)) {
    throw new ValidationError(`Invalid email address: ${email}`);
  }

  const userResult = await db.query(`SELECT email, password FROM users WHERE email='${email}'`);
  if (userResult.rowCount == 0) {
    throw new ValidationError(`Unable to locate user with email ${email}`);
  }

  const user = userResult.rows[0];
  if (!await bcrypt.compare(password, user.password)) {
    throw new ValidationError(`Invalid password`);
  }
};

export default router => {
  router.post('/user', async (req, res, next) => {
    try {
      await createUser({ ...req.body });
      return res.json({ status: 'OK '});
    } catch (error) {
      return next(error);
    }
  });

  router.post('/user/validate', async (req, res, next) => {
    try {
      await validateUser({ ...req.body });
      return res.json({ status: 'OK '});
    } catch (error) {
      return next(error);
    }
  });
};