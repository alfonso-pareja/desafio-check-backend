import { IsNotEmpty, IsEmail } from "class-validator";

export class LoginDto {
  @IsNotEmpty({ message: 'El email es requerido.' })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'La contraseña es requerida.' })
  password: string;
}
