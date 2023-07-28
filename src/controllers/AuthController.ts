import { Request, Response, NextFunction } from "express";
import { LoginDto } from "../dtos/LoginDto";
import { AuthService } from "../services/AuthService";
import { validateDto } from "../utils/dtoValidation";
import { plainToClass } from "class-transformer";


export class AuthController {
  static authService = new AuthService();

  static async loginUser(req: Request, res: Response, next: NextFunction) {
    try {
      const loginData: LoginDto = plainToClass(LoginDto, req.body);
      await validateDto(loginData);

      const { token, user } = await AuthController.authService.loginUser(loginData);
      const { password, deleted, ..._user } = user;

      res.status(200).json({
        status: "OK",
        statusCode: 200,
        message: "Inicio de sesión exitoso.",
        data: { ..._user, token },
      });
    } catch (err) {
      next(err);
    }
  }
}
