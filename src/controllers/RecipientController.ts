import { Request, Response, NextFunction } from "express";
import { CreateRecipientDto } from "../dtos/CreateRecipientDto";
import { RecipientService } from "../services/RecipientService";
import { plainToClass } from "class-transformer";
import { validateDto } from "../utils/dtoValidation";


export class RecipientController {
  static recipientService = new RecipientService();

  /**
   * Maneja la solicitud para crear un nuevo destinatario.
   * @param req La solicitud HTTP recibida.
   * @param res La respuesta HTTP a enviar.
   * @param next La funcion para pasar al siguiente middleware en caso de error.
   */
  static async createRecipient(req: Request, res: Response, next: NextFunction) {
    try {
      const recipientData: CreateRecipientDto = plainToClass(CreateRecipientDto, req.body);
      await validateDto(recipientData);

      const createdRecipient = await RecipientController.recipientService.createRecipient(recipientData);


      res.status(201).json({
        status: "OK",
        statusCode: 201,
        message: "Destinatario creado exitosamente.",
        data: createdRecipient,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Maneja la solicitud para obtener todos los destinatarios asociados a un usuario.
   * @param req La solicitud HTTP recibida.
   * @param res La respuesta HTTP a enviar.
   * @param next La funcion para pasar al siguiente middleware en caso de error.
   */
  static async getRecipientsByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = parseInt(req.params.userId, 10);
      const recipients = await RecipientController.recipientService.getRecipientsByUserId(userId);

      res.json({
        status: "OK",
        statusCode: 200,
        message: "Destinatarios obtenidos exitosamente.",
        data: recipients,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Maneja la solicitud para eliminar un destinatario por su ID.
   * @param req La solicitud HTTP recibida.
   * @param res La respuesta HTTP a enviar.
   * @param next La funcion para pasar al siguiente middleware en caso de error.
   */
  static async deleteRecipient(req: Request, res: Response, next: NextFunction) {
    try {
      const recipientId = parseInt(req.params.recipientId, 10);

      await RecipientController.recipientService.deleteRecipient(recipientId);

      res.json({
        status: "OK",
        statusCode: 200,
        message: "Destinatario eliminado exitosamente.",
        data: {},
      });
    } catch (err) {
      next(err);
    }
  }
}
