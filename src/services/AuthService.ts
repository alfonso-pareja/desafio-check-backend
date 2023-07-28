import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { LoginDto } from "../dtos/LoginDto";
import { User } from "../models/User";

export class AuthService {

  async loginUser(loginData: LoginDto): Promise<{ token: any; user: User; }> {
    const user = await User.findOne({ where: { email: loginData.email } });

    if (!user) throw new Error("Usuario no encontrado.");

    const isPasswordValid = await bcrypt.compare(
      loginData.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new Error("Contraseña incorrecta.");
    }

    const token = jwt.sign({ userId: user.userId }, process.env.SECRET_KEY, {
      expiresIn: "1h"
    });

    return { token, user: user.dataValues };
  }
}
