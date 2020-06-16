import { Table, Column, Model, HasMany, Unique, AllowNull, NotEmpty, IsEmail, Length, BeforeCreate } from 'sequelize-typescript';
import bcrypt from 'bcrypt';
import { Message } from './Message';
import { Col } from 'sequelize/types/lib/utils';

export class UserBase extends Model<UserBase> {
  @BeforeCreate
  static createToken = async (user: User) => {
    user.password = await user.generatePasswordHash();
  }

  @Unique
  @AllowNull(false)
  @NotEmpty
  @Column
  username: string;

  @Unique
  @AllowNull(false)
  @NotEmpty
  @IsEmail
  @Column
  email: string;

  @AllowNull(false)
  @NotEmpty
  @Length({ min: 7, max: 42 })
  @Column
  password: string;

  @HasMany(() => Message)
  messages: Message[];

  @Column
  role: string;
}

@Table
export class User extends UserBase {
  generatePasswordHash = async function() {
    const saltRounds = 10;
    return await bcrypt.hash(this.password, saltRounds);
  }

  validatePassword = async (password: string) => {
    return await bcrypt.compare(password, this.password);
  }
};

export class UserToken {
  id: number;
  username: string;
  email: string;
  role: string | undefined;
}
