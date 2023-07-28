import { CreateRecipientDto } from "../dtos/CreateRecipientDto";
import { Recipient } from "../models/Recipient";

export class RecipientService {
  async createRecipient(recipientData: CreateRecipientDto) {
    const { userId, recipientAccountNumber } = recipientData;

    // Verificar si ya existe un destinatario con el mismo recipientAccountNumber y userId
    const existingRecipient = await Recipient.findOne({
      where: { userId, recipientAccountNumber }
    });

    if (existingRecipient) {
      throw new Error(
        "Ya existe este destinatario para el usuario."
      );
    }

    return Recipient.create({ ...recipientData });
  }

  async getRecipientsByUserId(userId: number) {
    return Recipient.findAll({ where: { userId } });
  }
}
