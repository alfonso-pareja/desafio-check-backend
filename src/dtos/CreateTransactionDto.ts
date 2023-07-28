import { IsNotEmpty, IsNumberString } from "class-validator";

export class CreateTransactionDto {
  @IsNotEmpty({ message: 'El senderId es requerido.' })
  senderAccountNumber: string;

  @IsNotEmpty({ message: 'El receiverId es requerido.' })
  receiverAccountNumber: string;

  @IsNotEmpty({ message: 'El monto es requerido.' })
  amount: number;
}
