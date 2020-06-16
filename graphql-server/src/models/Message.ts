import { Table, ForeignKey, Column, Model, BelongsTo, NotEmpty } from 'sequelize-typescript';
import { User } from './User';

@Table
export class Message extends Model<Message> {
  @NotEmpty({ msg: 'A message has to have a text.' })
  @Column
  text: string;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User, {
    onDelete: 'CASCADE'
  })
  user: User;
}