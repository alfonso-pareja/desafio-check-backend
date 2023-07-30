import { Sequelize } from 'sequelize-typescript';
import  { DatabaseConnection } from '../../src/database/sequelize';

describe('DatabaseConnection', () => {
  let sequelize: Sequelize;

  beforeAll(async () => {
    // Configurar la conexion con la base de datos para las pruebas
    process.env.DB_HOST = 'ripley-dev.ct98rcovmjpj.us-east-1.rds.amazonaws.com';
    process.env.DB_PORT = '3306';
    process.env.DB_USERNAME = 'ripley';
    process.env.DB_PASSWORD = '!RipleyDev12';
    process.env.DB_NAME = 'ripley_schema';
    sequelize = await DatabaseConnection.connect();
  });

  afterAll(async () => {
    // Cerrar la conexion con la base de datos despues de las pruebas
    await sequelize.close();
  });

  it('should establish a database connection', async () => {
    try {
      // Llamar a la funcion connect de la clase DatabaseConnection
      const dbConnection = await DatabaseConnection.connect();

      // Verificar que la conexion sea valida
      expect(dbConnection).toBeDefined();
      expect(dbConnection).toBeInstanceOf(Sequelize);
      expect(dbConnection.authenticate).toBeInstanceOf(Function);
    } catch (error) {
      // Si la conexion falla, esta prueba fallara
      fail('Should not throw an error while connecting to the database');
    }
  });

  it('should reuse existing database connection', async () => {
    // Llamar a la funcion connect de la clase DatabaseConnection dos veces para probar la reutilizacion
    const dbConnection1 = await DatabaseConnection.connect();
    const dbConnection2 = await DatabaseConnection.connect();

    // Verificar que ambas conexiones sean iguales
    expect(dbConnection1).toBe(dbConnection2);
  });
});
