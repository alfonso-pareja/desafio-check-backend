import { Request, Response, NextFunction } from "express";
import { CreateUserDto } from "../dtos/CreateUserDto";
import { UserService } from "../services/UserService";
import { plainToClass } from "class-transformer";
import { validateDto } from "../utils/dtoValidation";
import bcrypt from "bcrypt";

export class UserController {
  static userService = new UserService();

  /**
   * Maneja la solicitud para crear un nuevo usuario y asociarle una cuenta.
   * @param req La solicitud HTTP recibida.
   * @param res La respuesta HTTP a enviar.
   * @param next La funcion para pasar al siguiente middleware en caso de error.
   */
  static async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userData: CreateUserDto = plainToClass(CreateUserDto, req.body);
      await validateDto(userData);

      // Validar que las contraseñas sean iguales
      if (userData.password !== userData.repeat_password) {
        throw { code: 200, message: "Las contraseñas no coinciden." };
      }

      // Realizar hash de la contraseña antes de almacenarla en la base de datos
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
      userData.password = hashedPassword;


      const userAccount = await UserController.userService.createUserAccount(userData);

      res.status(200).json({
        status: "OK",
        statusCode: 200,
        message: `Usuario ${userAccount.user.name} creado y asociado a la cuenta ${userAccount.account.accountNumber}`,
        data: userAccount,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Maneja la solicitud para obtener un usuario por su ID.
   * @param req La solicitud HTTP recibida.
   * @param res La respuesta HTTP a enviar.
   * @param next La funcion para pasar al siguiente middleware en caso de error.
   */
  static async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = parseInt(req.params.userId, 10);
      const { user, accountUser } = await UserController.userService.getUserById(userId);

      if (!user) {
        res.status(200).json({ status: "error", message: "Usuario no encontrado." });
        return;
      }

      // Excluir la contraseña y otros datos sensibles del usuario antes de enviar la respuesta
      const { password, deleted, ..._user } = user.dataValues;
      const { accountNumber, accountType, bank, balance, accountId } = accountUser;

      res.status(200).json({
        status: "OK",
        statusCode: 200,
        message: "Usuario.",
        data: {
          ..._user,
          accountNumber,
          accountType,
          bank,
          balance,
          accountId,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Maneja la solicitud para obtener todos los usuarios.
   * @param req La solicitud HTTP recibida.
   * @param res La respuesta HTTP a enviar.
   * @param next La funcion para pasar al siguiente middleware en caso de error.
   */
  static async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserController.userService.getAllUsers();
      res.json(users);
    } catch (err) {
      next(err);
    }
  }
}
