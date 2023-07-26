import { Table, Column, Model, ForeignKey, BelongsTo, PrimaryKey, DataType, AutoIncrement, CreatedAt } from 'sequelize-typescript';
import { Account } from './Account';

@Table({ tableName: 'TRANSACTIONS', timestamps: false })
export class Transaction extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({field: 'transaction_id', type: DataType.INTEGER})
  transactionId!: number;

  @ForeignKey(() => Account)
  @Column({field: 'sender_account_id', type: DataType.INTEGER})
  senderAccountId!: number;

  @BelongsTo(() => Account, 'senderAccountId')
  senderAccount!: Account;

  @ForeignKey(() => Account)
  @Column({field: 'receiver_account_id', type: DataType.INTEGER})
  receiverAccountId!: number;

  @BelongsTo(() => Account, 'receiverAccountId')
  receiverAccount!: Account;

  @Column
  amount!: string;

  @CreatedAt
  @Column({field: 'transaction_date', type: DataType.DATE})
  transactionDate!: Date;

  @Column({field: 'transaction_type', type: DataType.STRING})
  transactionType!: string;

  @Column
  status!: string;
}