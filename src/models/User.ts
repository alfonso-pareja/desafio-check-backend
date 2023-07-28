import { Table, Column, Model, PrimaryKey, DataType, AutoIncrement, CreatedAt, DeletedAt, UpdatedAt } from 'sequelize-typescript';

@Table({ tableName: 'USERS', paranoid: true, timestamps: true })
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({field: 'user_id', type: DataType.INTEGER})
  userId!: number;

  @Column
  name!: string;

  @Column
  email!: string;

  @Column
  address!: string;

  @Column
  phone!: string;

  @Column
  password!: string;

  @UpdatedAt
  updated!: Date;

  @DeletedAt
  deleted!: Date;

  @CreatedAt
  created!: Date;
}