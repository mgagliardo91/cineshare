import bcrypt from 'bcrypt';
import { isValidId } from 'utils/generateId';
import { ApiError, BadRequestError, NotAuthorizedError, ValidationError } from 'error';
import { User } from 'model';

const saltRounds = 10;
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const validateEmail = async (email) => {
  if (!emailRegex.test(email)) {
    throw new ValidationError(`Invalid email address: ${email}`);
  }

  const user = await User.findByEmail(email);
  if (user) {
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
  const user = await User.create({
    email,
    password: hash,
    displayName
  });
  if (!user) {
    throw new ApiError(`Unable to create user with email ${email}`, result);
  }

  return user;
};

export const getUserById = async (id) => {
  if (!isValidId(id)) {
    throw new BadRequestError(`Invalid user id ${id}`);
  }

  const user = await User.findByPk(id);
  if (!user) {
    return undefined;
  }

  return user;
};

export const getAndValidateUser = async ({ email, password }) => {
  if (typeof email === 'undefined' || !emailRegex.test(email)) {
    throw new ValidationError(`Invalid email address: ${email}`);
  }

  const user = await User.findByEmail(email);
  if (!user) {
    throw new ValidationError(`Unable to locate user with email ${email}`);
  }

  if (!await bcrypt.compare(password, user.password)) {
    throw new ValidationError(`Invalid password`);
  }

  return user;
};

export const validateUser = ({ user, params }) => {
  if (user.id !== params.userId) {
    throw new NotAuthorizedError('Unauthorized to execute request');
  }
};