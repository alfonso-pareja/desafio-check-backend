import { Sequelize } from 'sequelize-typescript';
import { User } from '../models/User';
import { Account } from '../models/Account';
import { LoginAttempt } from '../models/LoginAttempt';
import { Transaction } from '../models/Transaction';
import { Recipient } from '../models/Recipient';

let sequelize: Sequelize | undefined;

export const connectToDatabase = async () => {
  if (sequelize) {
    console.log('Reusing existing database connection');
    return sequelize;
  }

  console.log('Creating new database connection');
  sequelize = new Sequelize({
    dialect: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    models: [User, Account, Transaction, LoginAttempt, Recipient],
  });

  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }

  return sequelize;
};
