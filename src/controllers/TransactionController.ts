import { Request, Response, NextFunction } from "express";
import { CreateTransactionDto } from "../dtos/CreateTransactionDto";
import { TransactionService } from "../services/TransactionService";
import { validateDto } from "../utils/dtoValidation";
import { plainToClass } from "class-transformer";
import { DEFAULT_HEADERS } from '../utils/constants';

export class TransactionController {
  static transactionService = new TransactionService();

  /**
   * Maneja la solicitud para crear una nueva transferencia.
   * @param req La solicitud HTTP recibida.
   * @param res La respuesta HTTP a enviar.
   * @param next La funcion para pasar al siguiente middleware en caso de error.
   */
  static async createTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const transactionData: CreateTransactionDto = plainToClass(CreateTransactionDto, req.body);
      await validateDto(transactionData);

      const createdTransaction = await TransactionController.transactionService.createTransaction(transactionData);

      res.set(DEFAULT_HEADERS).status(200).json({
        status: "OK",
        statusCode: 200,
        message: "Transferencia creada exitosamente.",
        data: createdTransaction,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Maneja la solicitud para obtener todas las transacciones asociadas a una cuenta por su ID.
   * @param req La solicitud HTTP recibida.
   * @param res La respuesta HTTP a enviar.
   * @param next La funcion para pasar al siguiente middleware en caso de error.
   */
  static async getTransactionsByAccountId(req: Request, res: Response, next: NextFunction) {
    try {
      const accountId = parseInt(req.params.accountId, 10);
      const limitItems = req.query.limit || 100;

      // Verificar si el ID de la cuenta es valido
      if (isNaN(accountId)) {
        throw new Error("ID de cuenta inválido.")
      }

      const transactions = await TransactionController.transactionService.getTransactionsByAccountId(accountId, Number(limitItems));

      res.set(DEFAULT_HEADERS).status(200).json({
        status: "OK",
        statusCode: 200,
        message: "Transacciones obtenidas exitosamente.",
        data: transactions,
      });
    } catch (err) {
      next(err);
    }
  }
}
