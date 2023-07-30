import { CreateUserDto } from "../../src/dtos/CreateUserDto";
import { Account } from "../../src/models/Account";
import { User } from "../../src/models/User";
import { UserService } from "../../src/services/UserService";
import { Sequelize } from "sequelize-typescript";

describe("UserService", () => {
  let userService: UserService;
  let sequelizeMock: Sequelize;

  beforeEach(async () => {
    sequelizeMock = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      models: [User, Account],
    });
    await sequelizeMock.sync({ force: true });
    userService = new UserService();
  });

  afterEach(async () => {
    await Promise.all([
      User.truncate({ cascade: true }),
      Account.truncate({ cascade: true }),
    ]);
  });


  afterAll(async() => {
    jest.clearAllMocks();
    await sequelizeMock.close();
  });

  describe("createUserAccount", () => {
    test("should create a new user", async () => {
      // Datos del usuario de prueba
      const userData: CreateUserDto = {
        name: "Test User",
        email: "test@example.com",
        address: "North",
        phone: "+569344554",
        password: "test123",
        repeat_password: "test123"
      };

      // Simular el metodo findOne del modelo User
      User.findOne = jest.fn().mockResolvedValue(null)

      // Simular el metodo create del modelo User
      User.create = jest.fn().mockResolvedValue({
        userId: 1,
        ...userData
      });

      // Simular el metodo create del modelo Account
      Account.create = jest.fn().mockResolvedValue({
        accountId: 1,
        accountNumber: "1234567890",
        balance: 0,
        bank: "Banco Ripley",
        accountType: "Cuenta Corriente",
        userId: 1
      });

      // Llamar al metodo createUserAccount del servicio
      const result = await userService.createUserAccount(userData);

      // Verificar que el metodo User.findOne fue llamado con el email del usuario
      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: userData.email }
      });

      // Verificar que el metodo User.create fue llamado con los datos del usuario
      expect(User.create).toHaveBeenCalledWith(userData);

      // Verificar que el metodo Account.create fue llamado con los datos de la cuenta
      expect(Account.create).toHaveBeenCalledWith({
        accountNumber: expect.any(String),
        balance: 0,
        bank: "Banco Ripley",
        accountType: "Cuenta Corriente",
        userId: expect.any(Number)
      });

      // Verificar la estructura del resultado devuelto
      expect(result).toEqual({
        user: {
          userId: 1,
          ...userData
        },
        account: {
          accountId: 1,
          accountNumber: expect.any(String),
          balance: 0,
          bank: "Banco Ripley",
          accountType: "Cuenta Corriente",
          userId: 1
        }
      });
    });
  });
});
