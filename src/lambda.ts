import { connectToDatabase } from './database/sequelize';
import awsServerlessExpress from 'aws-serverless-express';
import 'dotenv/config';
import app from './app';

const server = awsServerlessExpress.createServer(app);


const setConnectionManager = async() => {
  try {
    await connectToDatabase();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

exports.handler = async(event: any, context: any) => {
  await setConnectionManager();
  return awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise;
};
