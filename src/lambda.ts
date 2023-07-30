import { DatabaseConnection } from './database/sequelize';
import awsServerlessExpress from 'aws-serverless-express';
import 'dotenv/config';
import app from './app';

const server = awsServerlessExpress.createServer(app);


// const setConnectionManager = async() => {
//   try {
//     await connectToDatabase();
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// }

const initializeApp = async () => {
  try {
    await DatabaseConnection.connect();
  } catch (error) {
    console.error('Error initializing the application:', error);
  }
};


exports.handler = async(event: any, context: any) => {
  initializeApp();
  return awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise;
};
