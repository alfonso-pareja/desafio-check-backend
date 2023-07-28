import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthService } from "../../src/services/AuthService";
import { LoginDto } from "../../src/dtos/LoginDto";
import { User } from "../../src/models/User";

describe("AuthService", () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should login a user", async () => {
    // Variables de entorno
    process.env.SECRET_KEY = "!RipleyDevSecretKey112";

    // Datos del usuario de prueba
    const loginData: LoginDto = {
      email: "john.doe@example.com",
      password: "password123"
    };

    // Simular el método findOne del modelo User
    User.findOne = jest.fn().mockResolvedValue({
      email: loginData.email,
      password: await bcrypt.hash(loginData.password, 10)
    });

    // Llamar al método loginUser del servicio
    const result = await authService.loginUser(loginData);

    // Verificar que el método findOne fue llamado con el email del usuario
    expect(User.findOne).toHaveBeenCalledWith({
      where: { email: loginData.email }
    });

    // Verificar la estructura del resultado devuelto
    expect(result).toEqual(expect.any(Object));
  });
});
