import { Request, Response, NextFunction } from "express";
import { CreateTransactionDto } from "../dtos/CreateTransactionDto";
import { TransactionService } from "../services/TransactionService";
import { validateDto } from "../utils/dtoValidation";
import { plainToClass } from "class-transformer";

export class TransactionController {
  static transactionService = new TransactionService();

  static async createTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const transactionData: CreateTransactionDto = plainToClass(CreateTransactionDto, req.body);
      await validateDto(transactionData);

      const createdTransaction = await TransactionController.transactionService.createTransaction(transactionData);

      res.status(201).json({
        status: "OK",
        statusCode: 201,
        message: "Transferencia creada exitosamente.",
        data: createdTransaction,
      });
    } catch (err) {
      next(err);
    }
  }
}
