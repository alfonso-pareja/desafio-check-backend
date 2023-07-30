import { CreateUserDto } from "../dtos/CreateUserDto";
import { User } from "../models/User";
import { Account } from "../models/Account";
import { AccountService } from "./AccountService";


export class UserService {
  accountService: AccountService;

  constructor() {
    this.accountService = new AccountService();
  }

  /**
   * Crea un nuevo usuario y abre una cuenta para el mismo.
   * @param userData Los datos del nuevo usuario.
   * @returns Un objeto que contiene el usuario recien creado y la cuenta asociada.
   * @throws {Error} Si el correo electronico ya existe o si ocurre un error al crear el usuario o la cuenta.
   */
  async createUserAccount(userData: CreateUserDto): Promise<{ user: User; account: Account }> {
    // Verificar si el correo electronico ya existe
    const existingUser = await User.findOne({ where: { email: userData.email } });
    if (existingUser) {
      throw new Error("Email ya existe.");
    }

    // Creacion del nuevo usuario
    const newUser = await User.create({ ...userData });
    if (!newUser.userId) {
      throw new Error("No se logró crear el usuario.");
    }

    // Abriendo una nueva cuenta para el usuario creado
    const account = await this.accountService.createAccount(newUser.userId);
    if (!account.accountId) {
      throw new Error("No se logró asociar la cuenta al usuario.");
    }

    return {
      user: newUser,
      account,
    };
  }

  /**
   * Obtiene un usuario por su ID junto con su cuenta asociada.
   * @param userId El ID del usuario a obtener.
   * @returns Un objeto que contiene el usuario y su cuenta asociada.
   */
  async getUserById(userId: number): Promise<{ user: User; accountUser: Account }> {
    const user = await User.findOne({ where: { userId } });
    const accountUser = await Account.findOne({ where: { userId: user.userId } });

    return { user, accountUser };
  }

  /**
   * Obtiene todos los usuarios registrados.
   * @returns Un arreglo de todos los usuarios registrados.
   */
  async getAllUsers(): Promise<User[]> {
    return User.findAll();
  }
}
