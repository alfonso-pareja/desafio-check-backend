import { Sequelize } from 'sequelize-typescript';
import { User } from '../models/User';
import { Account } from '../models/Account';
import { LoginAttempt } from '../models/LoginAttempt';
import { Transaction } from '../models/Transaction';
import { Recipient } from '../models/Recipient';

export class DatabaseConnection {
  private static sequelize: Sequelize | undefined;

  public static async connect(): Promise<Sequelize> {
    console.log(!!DatabaseConnection.sequelize)
    if (!DatabaseConnection.sequelize) {
      console.log('Creating new database connection');
      DatabaseConnection.sequelize = new Sequelize({
        dialect: 'mysql',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        models: [User, Account, Transaction, LoginAttempt, Recipient],
      });

      console.log(!!DatabaseConnection.sequelize)

      try {
        await DatabaseConnection.sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error;
      }
    } else {
      console.log('Reusing existing database connection');
    }

    return DatabaseConnection.sequelize;
  }
}
