import { CreateUserDto } from "../dtos/CreateUserDto";
import { User } from "../models/User";
import { Account } from "../models/Account";
import { AccountService } from "./AccountService";

export class UserService {
    accountService: AccountService;

    constructor() {
      this.accountService = new AccountService();
    }

  async createUserAccount(userData: CreateUserDto) {
    //Verificar si el email ya existe
    const existingUser = await User.findOne({
      where: { email: userData.email }
    });
    if (existingUser) {
      throw ({ code: 400, message: "Email ya existe." });
    }

    // Creacion del nuevo usuario
    const newUser = await User.create({ ...userData });
    if (!newUser.userId) throw new Error("No se logro crear el usuario.");

    // Abriendo una nueva cuenta para el usuario creado
    const account = await this.accountService.createAccount(newUser.userId);

    if (!account.accountId)
      throw new Error("No se logro asociar la cuenta al usuario.");

    return {
      user: newUser,
      account
    };
  }

  async getUserById(userId: number) {
    return User.findOne({ where: { userId } });
  }

  async getAllUsers() {
    return User.findAll();
  }
}
