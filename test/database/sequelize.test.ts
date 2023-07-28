import { Sequelize } from 'sequelize-typescript';
import { User } from '../../src/models/User';
import { Account } from '../../src/models/Account';
import { LoginAttempt } from '../../src/models/LoginAttempt';
import { Transaction } from '../../src/models/Transaction';
import { connectToDatabase } from '../../src/database/sequelize';
import { Recipient } from '../../src/models/Recipient';


describe('connectToDatabase', () => {
  let sequelize: Sequelize;

  beforeAll(() => {
    // Configurar la conexión con la base de datos para las pruebas
    sequelize = new Sequelize({
      dialect: 'mysql',
      host: 'ripley-dev.ct98rcovmjpj.us-east-1.rds.amazonaws.com',
      port: 3306,
      username: 'ripley',
      password: '!RipleyDev12',
      database: 'ripley_schema',
      models: [User, Account, Transaction, LoginAttempt, Recipient],
    });
  });

  afterAll(async () => {
    // Cerrar la conexión con la base de datos después de las pruebas
    // await sequelize.close();
  });

  it('should establish a database connection', async () => {
    try {
      // Simular el entorno con variables de entorno
      process.env.DB_HOST = 'ripley-dev.ct98rcovmjpj.us-east-1.rds.amazonaws.com';
      process.env.DB_PORT = '3306';
      process.env.DB_USERNAME = 'ripley';
      process.env.DB_PASSWORD = '!RipleyDev12';
      process.env.DB_NAME = 'ripley_schema';

      // Llamar a la función connectToDatabase
      const dbConnection = await connectToDatabase();

      // Verificar que la conexión sea válida
      expect(dbConnection).toBeDefined();
      expect(dbConnection).toBeInstanceOf(Sequelize);
      expect(dbConnection.authenticate).toBeInstanceOf(Function);
    } catch (error) {
      // Si la conexión falla, esta prueba fallará
      fail('Should not throw an error while connecting to the database');
    }
  });

  it('should reuse existing database connection', async () => {
    // Llamar a la función connectToDatabase dos veces para probar la reutilización
    const dbConnection1 = await connectToDatabase();
    const dbConnection2 = await connectToDatabase();

    // Verificar que ambas conexiones sean iguales (reutilización)
    expect(dbConnection1).toBe(dbConnection2);
  });


});
