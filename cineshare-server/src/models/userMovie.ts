import {
  Table,
  Column,
  PrimaryKey,
  Model,
  AllowNull,
  Is,
  Default,
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";
import generateId, { isValidId } from "../utils/id";
import { User } from "./user";
import { Movie } from "./movie";

@Table({ underscored: true, modelName: "userMovie" })
export class UserMovie extends Model<UserMovie> {
  @PrimaryKey
  @AllowNull(false)
  @Is("Valid Id", (value: string) => {
    if (!isValidId(value)) {
      throw new Error(`"${value}" is not a a valid id.`);
    }
  })
  @Default(generateId)
  @Column
  id: string;

  @AllowNull
  @Column
  rating: number;

  @AllowNull(false)
  @Default(false)
  @Column
  seen: boolean;

  @ForeignKey(() => Movie)
  @AllowNull(false)
  @Column({
    unique: "owned_unique",
  })
  movieId: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({
    unique: "owned_unique",
  })
  userId: string;

  @BelongsTo(() => Movie, "movieId")
  movie: Movie;

  @BelongsTo(() => User, { foreignKey: "userId", onDelete: "CASCADE " })
  user: User;

  static findByMovieId = async (movieId: string, userId: string) => {
    return await UserMovie.findOne({ where: { movieId, userId } });
  };
}
