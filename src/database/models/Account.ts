import { Table, Column, Model, ForeignKey, BelongsTo, PrimaryKey, DataType, AutoIncrement, CreatedAt, DeletedAt } from 'sequelize-typescript';
import { User } from './User';

@Table({ tableName: 'ACCOUNTS', timestamps: false })
export class Account extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({field: 'account_id', type: DataType.INTEGER})
  accountId!: number;

  @ForeignKey(() => User)
  @Column({field: 'user_id', type: DataType.INTEGER})
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @Column({field: 'account_number', type: DataType.STRING})
  accountNumber!: string;

  @Column
  balance!: string;

  @CreatedAt
  created!: Date;

  @DeletedAt
  deleted!: Date;
}
