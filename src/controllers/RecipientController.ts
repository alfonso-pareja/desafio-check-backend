import { Request, Response, NextFunction } from "express";
import { CreateRecipientDto } from "../dtos/CreateRecipientDto";
import { RecipientService } from "../services/RecipientService";
import { plainToClass } from "class-transformer";
import { validateDto } from "../utils/dtoValidation";

export class RecipientController {
  static recipientService = new RecipientService();

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
}
