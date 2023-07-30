import { Request, Response, NextFunction } from "express";
import { ValidationError } from "class-validator";

/**
 * Middleware para manejar errores.
 * @param err El error ocurrido.
 * @param req La solicitud HTTP recibida.
 * @param res La respuesta HTTP a enviar.
 * @param next La función para pasar al siguiente middleware.
 */
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {

  const message = err.message || "An unexpected error occurred";


  // Si el error es una instancia de ValidationError (proveniente de class-validator)
  // entonces construimos un objeto con los mensajes de error para retornarlos en la respuesta.
  if (err instanceof ValidationError) {
    const validationErrors = getValidationErrors(err);
    res.status(200).json({
      status: "error",
      statusCode: 200,
      message: "Validation Error",
      errors: validationErrors,
    });
  } else {
    res.status(200).json({
      status: err.status || "error",
      statusCode: 200,
      message: message,
    });
  }
}

/**
 * Obtiene los mensajes de error de una instancia de ValidationError (proveniente de class-validator).
 * @param err La instancia de ValidationError.
 * @returns Un arreglo con los mensajes de error.
 */
function getValidationErrors(err: ValidationError): string[] {
  const errors: string[] = [];
  for (const property in err.constraints) {
    if (err.constraints.hasOwnProperty(property)) {
      errors.push(err.constraints[property]);
    }
  }
  return errors;
}
