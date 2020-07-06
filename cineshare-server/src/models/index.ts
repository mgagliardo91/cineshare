import { Sequelize } from "sequelize-typescript";
import { User } from "./user";
import { UserMovie } from "./userMovie";
import { Movie } from "./movie";
import { ModelCtor, Model } from "sequelize";

const sequelize = new Sequelize("postgres", "postgres", "postgres", {
  dialect: "postgres",
  port: 6000,
});
sequelize.addModels([User, Movie, UserMovie]);

export { sequelize };

export type LocalModel<P> = ModelCtor<Model<any, any>> & P;

export interface Models {
  User: LocalModel<typeof User>;
  Movie: LocalModel<typeof Movie>;
  UserMovie: LocalModel<typeof UserMovie>;
}

const models: Models = {
  User: sequelize.models["user"] as any,
  Movie: sequelize.models["movie"] as any,
  UserMovie: sequelize.models["userMovie"] as any,
};

export default models;
