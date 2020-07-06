import {
  Table,
  Column,
  Model,
  Unique,
  AllowNull,
  NotEmpty,
  PrimaryKey,
  Is,
  Default,
  DataType,
  IsUrl,
} from "sequelize-typescript";
import generateId, { isValidId } from "../utils/id";

const imdbIdRegex = /^tt\d+$/;

@Table({ underscored: true, modelName: "movie" })
export class Movie extends Model<Movie> {
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

  @NotEmpty
  @AllowNull(false)
  @Column
  title: string;

  @AllowNull(false)
  @Unique
  @Is("IMDb Id", (value: string) => {
    if (!imdbIdRegex.test(value)) {
      throw new Error(`"${value}" is not an IMDb Id.`);
    }
  })
  @Column
  imdbId: string;

  @AllowNull(true)
  @IsUrl
  @Column
  imageUrl: string;

  @AllowNull(false)
  @Column(DataType.JSONB)
  data: object;

  static findByImdbId = async (imdbId: string) => {
    return await Movie.findOne({ where: { imdbId } });
  };
}
