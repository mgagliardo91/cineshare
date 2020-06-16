import { Table, Column, PrimaryKey, Model, Unique, AllowNull, NotEmpty, IsEmail, Length, BeforeCreate, Is, Default, HasMany } from 'sequelize-typescript';
import bcrypt from 'bcrypt';
import generateId, { isValidId } from '../utils/id';
import { UserMovie } from './userMovie';

@Table({ underscored: true, modelName: 'user' })
export class User extends Model<User> {
  @BeforeCreate
  static createToken = async (user: User) => {
    user.password = await user.generatePasswordHash();
  }

  @PrimaryKey
  @AllowNull(false)
  @Is('Valid Id', (value: string) => {
    if (!isValidId(value)) {
      throw new Error(`"${value}" is not a a valid id.`);
    }
  })
  @Default(generateId)
  @Column
  id: string;

  @AllowNull(false)
  @NotEmpty
  @Unique
  @IsEmail
  @Column
  email: string;

  @AllowNull(false)
  @Length({ min: 7, max: 42 })
  @Column
  password: string;

  @AllowNull(true)
  @Column
  displayName: string;

  @HasMany(() => UserMovie)
  movies: UserMovie[];

  findByEmail = async (email: string): Promise<User|undefined> => {
    return await User.findOne({ where: { email } });
  }

  generatePasswordHash = async function() {
    const saltRounds = 10;
    return await bcrypt.hash(this.password, saltRounds);
  }

  validatePassword = async (password: string) => {
    return await bcrypt.compare(password, this.password);
  }
}