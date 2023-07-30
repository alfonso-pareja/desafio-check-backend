import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { LoginDto } from "../dtos/LoginDto";
import { User } from "../models/User";
import { Account } from "../../src/models/Account";
import { LoginAttempt } from "../../src/models/LoginAttempt";


export class AuthService {

  /**
   * Autentica a un usuario y genera un token JWT valido.
   * @param loginData Los datos de inicio de sesion del usuario (email y password).
   * @returns Token JWT, el usuario autenticado y su cuenta asociada.
   * @throws {Error} Si el usuario no es encontrado o si la contraseña es incorrecta.
   */
  async loginUser(loginData: LoginDto): Promise<{ token: string; user: User; account: Account }> {
    const user = await User.findOne({ where: { email: loginData.email } });

    if (!user) {
      throw new Error("Usuario no encontrado.");
    }

    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);

    if (!isPasswordValid) {
      this.createLoginAttempt(user.userId, 'REJECTED', '')
      throw new Error("Contraseña incorrecta.");
    }

    const accountUser = await Account.findOne({
      where: { userId: user.userId }
    });

    const token = jwt.sign({ userId: user.userId }, process.env.SECRET_KEY, {
      expiresIn: "1h"
    });

    this.createLoginAttempt(user.userId, 'SUCCESS', String(token))
    return { token, user: user.dataValues, account: accountUser };
  }

  private async createLoginAttempt(userId: number, status: string, token?: string) {
    try {
      await LoginAttempt.create({
        loginStatus: status,
        loginIp: null,
        userId: userId,
        token
      });
    } catch (error) {
      // Handle any errors that may occur during login attempt logging (optional)
      console.error("Error logging login attempt:", error);
    }
  }
}
