import bcrypt from 'bcrypt';
import db from 'utils/db';
import generateId, { isValidId } from 'utils/generateId';
import { ValidationError, NotFoundError } from 'error';
import { ApiError, BadRequestError } from '../error';

const saltRounds = 10;
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const validateEmail = async (email) => {
  if (!emailRegex.test(email)) {
    throw new ValidationError(`Invalid email address: ${email}`);
  }

  const userResult = await db.query(`SELECT * FROM users WHERE email='${email}'`);
  if (userResult.rowCount > 0) {
    throw new ValidationError(`An account with the email '${email}' already exists.`)
  }
};

export const createUser = async ({ email, password, displayName }) => {
  await validateEmail(email);
  const hash = await bcrypt.hash(password, saltRounds);
  console.log(`Creating user with values`, {
    email,
    password: hash,
    displayName
  });
  const result = await db.query('INSERT INTO users (id, email, password, display_name) VALUES ($1, $2, $3, $4) RETURNING *', [generateId(), email, hash, displayName]);
  if (result.rowCount != 1) {
    throw new ApiError(`Unable to create user with email ${email}`, result);
  }

  console.log(result.rows)
  return result.rows[0];
};

export const getUserById = async (id) => {
  if (!isValidId(id)) {
    throw new BadRequestError(`Invalid user id ${id}`);
  }

  const userResult = await db.query(`SELECT * FROM users WHERE id='${id}'`);
  if (userResult.rowCount = 0) {
    return undefined;
  }

  return userResult.rows[0];
};

export const getAndValidateUser = async ({ email, password }) => {
  if (typeof email === 'undefined' || !emailRegex.test(email)) {
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