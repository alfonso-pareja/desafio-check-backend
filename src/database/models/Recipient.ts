import { Table, Column, Model, ForeignKey, BelongsTo, PrimaryKey, DataType, AutoIncrement } from 'sequelize-typescript';
import { User } from './User';

@Table({ tableName: 'RECIPIENTS', timestamps: false })
export class Recipient extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({field: 'recipient_id', type: DataType.INTEGER})
  recipientId!: number;

  @ForeignKey(() => User)
  @Column({field: 'user_id', type: DataType.INTEGER})
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @Column({field: 'recipient_name', type: DataType.STRING})
  recipientName!: string;

  @Column({field: 'recipient_account_number', type: DataType.STRING})
  recipientAccountNumber!: string;
}