import { IsNotEmpty, IsNumberString } from "class-validator";

export class CreateRecipientDto {
  @IsNotEmpty({ message: 'El userId es requerido.' })
  @IsNumberString()
  userId: string;

  @IsNotEmpty({ message: 'El recipientName es requerido.' })
  recipientName: string;

  @IsNotEmpty({ message: 'El recipientAccountNumber es requerido.' })
  @IsNumberString()
  recipientAccountNumber: string;
}
