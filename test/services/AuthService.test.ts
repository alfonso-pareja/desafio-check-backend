import bcrypt from "bcrypt";  
import { AuthService } from "../../src/services/AuthService";
import { LoginDto } from "../../src/dtos/LoginDto";
import { User } from "../../src/models/User";
import { Sequelize } from "sequelize-typescript";
import { Account } from "../../src/models/Account";
import { LoginAttempt } from "../../src/models/LoginAttempt";

describe("AuthService", () => {
  let authService: AuthService;
  let sequelizeMock: Sequelize; 

  beforeEach(async() => {
    sequelizeMock = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      models: [User, Account, LoginAttempt],
    });
    await sequelizeMock.sync({ force: true })
    authService = new AuthService();
  });

  afterEach(async () => {
    await Promise.all([
      User.truncate({ cascade: true }),
      Account.truncate({ cascade: true }),
      LoginAttempt.truncate({ cascade: true })
    ]);
  });


  afterAll(async() => {
    jest.clearAllMocks();
    await sequelizeMock.close();
  });

  test("should login a user with valid credentials", async () => {
    // Variables de entorno
    process.env.SECRET_KEY = "!RipleyDevSecretKey112";

    // Datos del usuario de prueba
    const loginData: LoginDto = {
      email: "john@example.com",
      password: "password123",
    };

    // Simular el método findOne del modelo User
    User.findOne = jest.fn().mockResolvedValue({
      userId: 1, 
      email: loginData.email,
      password: await bcrypt.hash(loginData.password, 10),
    });

    // Llamar al método loginUser del servicio
    const result = await authService.loginUser(loginData);

    // Verificar que el método findOne fue llamado con el email del usuario
    expect(User.findOne).toHaveBeenCalledWith({
      where: { email: loginData.email },
    });

    // Verificar la estructura del resultado devuelto
    expect(result).toEqual(expect.any(Object));
  });

  test("should throw an error if the user is not found", async () => {
    // Datos del usuario de prueba
    const loginData: LoginDto = {
      email: "john@example.com",
      password: "password123",
    };

    // Simular el método findOne del modelo User que no encuentra al usuario
    User.findOne = jest.fn().mockResolvedValue(null);

    LoginAttempt.create = jest.fn().mockResolvedValue(null);

    // Llamar al método loginUser del servicio y esperar que lance un error
    await expect(authService.loginUser(loginData)).rejects.toThrow("Usuario no encontrado.");
  });

  test("should throw an error if the password is incorrect", async () => {
    // Datos del usuario de prueba
    const loginData: LoginDto = {
      email: "john@example.com",
      password: "incorrectpassword",
    };

    // Simular el método findOne del modelo User con un password incorrecto
    User.findOne = jest.fn().mockResolvedValue({
      email: loginData.email,
      password: await bcrypt.hash("password123", 10),
    });

    // Llamar al método loginUser del servicio y esperar que lance un error
    await expect(authService.loginUser(loginData)).rejects.toThrow("Contraseña incorrecta.");
  });
});
