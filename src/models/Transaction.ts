import { Table, Column, Model, ForeignKey, BelongsTo, PrimaryKey, DataType, AutoIncrement, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import { Account } from './Account';

@Table({ tableName: 'TRANSACTIONS', timestamps: true })
export class Transaction extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({field: 'transaction_id', type: DataType.INTEGER, autoIncrement: true })
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
  amount!: number;

  @Column({ field: 'receiver_account_name', type: DataType.STRING })
  receiverAccountName!: number;

  @Column({field: 'transaction_number', type: DataType.NUMBER})
  transactionNumber!: number;

  @CreatedAt
  @Column({field: 'transaction_date', type: DataType.DATE})
  transactionDate!: Date;

  @UpdatedAt
  updated!: Date;

  @Column({field: 'transaction_type', type: DataType.STRING})
  transactionType!: string;

  @Column
  status!: string;
}