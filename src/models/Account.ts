import { Table, Column, Model, ForeignKey, BelongsTo, PrimaryKey, DataType, AutoIncrement, CreatedAt, DeletedAt, UpdatedAt } from 'sequelize-typescript';
import { User } from './User';

@Table({ tableName: 'ACCOUNTS', paranoid: true, timestamps: true })
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

  @Column({ type: DataType.STRING, defaultValue: 'Banco Ripley' })
  bank!: string;

  @Column({ field: 'account_type', type: DataType.STRING, defaultValue: 'Cuenta Corriente' })
  accountType!: string;

  @Column
  balance!: number;

  @UpdatedAt
  updated!: Date;
  
  @CreatedAt
  created!: Date;

  @DeletedAt
  deleted!: Date;

}
