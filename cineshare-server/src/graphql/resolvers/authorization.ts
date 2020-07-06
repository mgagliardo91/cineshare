import { ForbiddenError } from "apollo-server-express";
import { Context } from "../types";
import { skip } from "graphql-resolvers";

export function isAuthenticated<TSource, TArgs>(
  _parent: TSource,
  _args: TArgs,
  { user }: Context
) {
  return user ? skip : new ForbiddenError("Not authenticated as user.");
}
