import { Account } from "../models/Account";
import { CreateRecipientDto } from "../dtos/CreateRecipientDto";
import { Recipient } from "../models/Recipient";

export class RecipientService {
  /**
   * Crea un nuevo destinatario asociado a un usuario.
   * @param recipientData Datos del destinatario.
   * @returns El destinatario creado.
   * @throws {Error} Si no se encuentra una cuenta asociada al numero de cuenta ingresado.
   * @throws {Error} Si ya existe un destinatario con el mismo recipientAccountNumber y userId.
   */
  async createRecipient(recipientData: CreateRecipientDto) {
    const { userId, recipientAccountNumber } = recipientData;

    // Verificar si existe una cuenta asociada al numero de cuenta ingresado.
    const existingAccount = await Account.findOne({
      where: { accountNumber: recipientAccountNumber }
    });

    if (!existingAccount) {
      throw new Error("No se encontró una cuenta asociada al número de cuenta ingresado.");
    }

    // Verificar si ya existe un destinatario con el mismo recipientAccountNumber y userId.
    const existingRecipient = await Recipient.findOne({
      where: { recipientAccountNumber, userId }
    });

    if (existingRecipient) {
      throw new Error("Ya existe este destinatario para el usuario.");
    }

    return Recipient.create({ ...recipientData, userId });
  }

  /**
   * Elimina un destinatario por su ID.
   * @param recipientId El ID del destinatario a eliminar.
   * @returns Eliminacion del destinatario
   * @throws {Error} Si no se encuentra el destinatario con el ID proporcionado.
   */
  async deleteRecipient(recipientId: number) {
    const recipient = await Recipient.findByPk(recipientId);
    if (!recipient) {
      throw new Error("No se encontró el destinatario con el ID proporcionado.");
    }

    await recipient.destroy();

    return { code: 200, status: true, message: "Destinatario eliminado exitosamente." };
  }

  /**
   * Obtiene todos los destinatarios asociados a un usuario por su ID de usuario.
   * @param userId El ID del usuario para el cual se obtendran los destinatarios.
   * @returns Un arreglo de destinatarios asociados al usuario.
   */
  async getRecipientsByUserId(userId: number) {
    return Recipient.findAll({ where: { userId } });
  }
}
