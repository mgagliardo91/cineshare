import bcrypt from 'bcrypt';
import db from '../db';
import { ValidationError } from '../error';
import NotFoundError from '../error/NotFoundError';

const saltRounds = 10;
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const createUser = async ({ email, password, displayName }) => {
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

export const getUser = async ({ id }) => {
  const userResult = await db.query(`SELECT * FROM users WHERE id='${id}'`);
  if (userResult.rowCount = 0) {
    throw new NotFoundError(`Unable to locate user with id: ${id}`);
  }

  return userResult.rows[0];
};

export const getAndValidateUser = async ({ email, password }) => {
  if (!emailRegex.test(email)) {
    throw new ValidationError(`Invalid email address: ${email}`);
  }

  const userResult = await db.query(`SELECT * FROM users WHERE email='${email}'`);
  if (userResult.rowCount == 0) {
    throw new ValidationError(`Unable to locate user with email ${email}`);
  }

  const user = userResult.rows[0];
  if (!await bcrypt.compare(password, user.password)) {
    throw new ValidationError(`Invalid password`);
  }

  return user;
};