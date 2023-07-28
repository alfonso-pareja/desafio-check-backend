
import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'El nombre es requerido.' })
  name: string;

  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  email: string;

  @IsNotEmpty({ message: 'La dirección es requerida.' })
  address: string;

  @IsNotEmpty({ message: 'El teléfono es requerido.' })
  phone: string;

  @IsNotEmpty({ message: 'La constraseña es requerido.' })
  password: string;

  repeat_password: string;
}
