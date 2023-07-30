import { Request, Response, NextFunction } from "express";
import { LoginDto } from "../dtos/LoginDto";
import { AuthService } from "../services/AuthService";
import { validateDto } from "../utils/dtoValidation";
import { plainToClass } from "class-transformer";

export class AuthController {
  static authService = new AuthService();

  /**
   * Maneja la solicitud para iniciar sesion de un usuario.
   * @param req La solicitud HTTP recibida.
   * @param res La respuesta HTTP a enviar.
   * @param next La funcion para pasar al siguiente middleware en caso de error.
   */
  static async loginUser(req: Request, res: Response, next: NextFunction) {
    try {
      const loginData: LoginDto = plainToClass(LoginDto, req.body);
      await validateDto(loginData);

      const { token, user, account } = await AuthController.authService.loginUser(loginData);
      const { password, deleted, ..._user } = user;
      const { accountNumber, accountType, bank, balance, accountId } = account;

      res.status(200).json({
        status: "OK",
        statusCode: 200,
        message: "Inicio de sesión exitoso.",
        data: {
          ..._user,
          accountNumber,
          accountType,
          bank,
          balance,
          accountId,
          token,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}
