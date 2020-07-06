import models from "../../models";
import { batchId } from "./utils";
import { User } from "../../models/user";

export const batchUsers = async (keys: string[]): Promise<User[]> => {
  return (await batchId(keys, models.User)) as User[];
};
