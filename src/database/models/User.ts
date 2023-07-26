import { Table, Column, Model, PrimaryKey, DataType, AutoIncrement, CreatedAt, DeletedAt } from 'sequelize-typescript';

@Table({ tableName: 'USERS', timestamps: false })
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

  @DeletedAt
  deleted!: Date;

  @CreatedAt
  created!: Date;
}