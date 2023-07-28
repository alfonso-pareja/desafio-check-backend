import { Request, Response, NextFunction } from "express";
import { ValidationError } from "class-validator";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let statusCode = err.statusCode || err.code || 500;
  const message = err.message || "An unexpected error occurred";

  console.log(err);
  // Verificar si el error es una instancia de ValidationError de class-validator
  if (err instanceof ValidationError) {
    statusCode = 400;
  }

  res.status(statusCode).json({
    status: "error",
    statusCode: statusCode,
    message: message
  });
}
