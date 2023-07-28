import { validate } from "class-validator";

export async function validateDto<T extends object>(dtoInstance: T): Promise<void> {
  const errors = await validate(dtoInstance);

  if (errors.length > 0) {
    const errorMessages = errors
      .map((error) => Object.values(error.constraints || {}))
      .join(" ");
    throw ({ code: 400, message: errorMessages });
  }
}
