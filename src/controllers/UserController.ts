import { Request, Response, NextFunction } from "express";
import { CreateUserDto } from "../dtos/CreateUserDto";
import { UserService } from "../services/UserService";
import { plainToClass } from "class-transformer";
import { HTTP_STATUS_CODES } from "../utils/constants";
import { validateDto } from "../utils/dtoValidation";
import bcrypt from "bcrypt";

export class UserController {
  static userService = new UserService();

  static async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userData: CreateUserDto = plainToClass(CreateUserDto, req.body);
      await validateDto(userData);
      
      //Validar contraseñas sean iguales
      if (userData.password !== userData.repeat_password)
        throw ({ code: 400, message: "Las contraseñas no coinciden." });

      // Hash de la contraseña
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
      userData.password = hashedPassword;

      const userAccount = await UserController.userService.createUserAccount(userData);

      res
        .status(HTTP_STATUS_CODES.CREATED)
        .json({ 
          status: 'OK', 
          statusCode: 200,
          message: `Usuario ${userAccount.user.name} creado y asociado a la cuenta ${userAccount.account.accountNumber}`,
          data: userAccount
        });
    } catch (err) {
      next(err);
    }
  }

  static async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserController.userService.getUserById(1);
      if (!user) {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ error: "Usuario no encontrado." });
        return;
      }
      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  static async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserController.userService.getAllUsers();
      res.json(users);
    } catch (err) {
      next(err);
    }
  }
}
