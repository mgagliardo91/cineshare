import jwt from "jsonwebtoken";
import { AuthenticationError } from "apollo-server-express";
import { UserToken } from "./types";
import { User } from "../models/user";

interface AuthenticationHeader {
  authorization?: string;
}

const secret = process.env.SECRET;

export const verifyJwt = async (token: string): Promise<UserToken> => {
  return (await jwt.verify(token, secret)) as UserToken;
};

export const createUserToken = async (user: User) => {
  const { id, email } = user;
  return await jwt.sign({ id, email }, secret, { expiresIn: "1h" });
};

export const getRequestUser = async ({
  authorization: token,
}: AuthenticationHeader) => {
  if (token) {
    if (!token.startsWith("Bearer ")) {
      return undefined;
    }

    try {
      return await verifyJwt(token.replace("Bearer ", ""));
    } catch (e) {
      throw new AuthenticationError("Your session expired. Sign in again.");
    }
  }

  return undefined;
};
