import { CreateRecipientDto } from "../../src/dtos/CreateRecipientDto";
import { Recipient } from "../../src/models/Recipient";
import { RecipientService } from "../../src/services/RecipientService";

describe('RecipientService', () => {
  let recipientService: RecipientService;

  beforeEach(() => {
    recipientService = new RecipientService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createRecipient', () => {
    test('should create a new recipient', async () => {
      // Datos del destinatario de prueba
      const recipientData: CreateRecipientDto = {
        userId: "1",
        recipientAccountNumber: '1234567890',
        recipientName: 'Recipient Test',
      };

      // Simular el método findOne del modelo Recipient (para que el destinatario no exista)
      jest.spyOn(Recipient, 'findOne').mockResolvedValue(null);

      // Simular el método create del modelo Recipient
      jest.spyOn(Recipient, 'create').mockResolvedValue({
        recipientId: 1,
        ...recipientData,
      });

      // Llamar al método createRecipient del servicio
      const createdRecipient = await recipientService.createRecipient(recipientData);

      // Verificar que el método Recipient.findOne fue llamado con los datos del destinatario
      expect(Recipient.findOne).toHaveBeenCalledWith({
        where: { userId: recipientData.userId, recipientAccountNumber: recipientData.recipientAccountNumber },
      });

      // Verificar que el método Recipient.create fue llamado con los datos del destinatario
      expect(Recipient.create).toHaveBeenCalledWith(recipientData);

      // Verificar la estructura del destinatario creado
      expect(createdRecipient).toEqual({
        recipientId: 1,
        ...recipientData,
      });
    });

    test('should throw an error if the recipient already exists', async () => {
      // Datos del destinatario de prueba
      const recipientData: CreateRecipientDto = {
        userId: "1",
        recipientAccountNumber: '1234567890',
        recipientName: 'Recipient Test',
      };

      // Simular el método findOne del modelo Recipient (para que el destinatario ya exista)
      Recipient.findOne = jest.fn().mockResolvedValue({
        recipientId: 1,
        ...recipientData,
      })

      // Llamar al método createRecipient del servicio y verificar que lance un error
      await expect(recipientService.createRecipient(recipientData)).rejects.toThrowError(
        'Ya existe este destinatario para el usuario.'
      );

      // Verificar que el método Recipient.findOne fue llamado con los datos del destinatario
      expect(Recipient.findOne).toHaveBeenCalledWith({
        where: { userId: recipientData.userId, recipientAccountNumber: recipientData.recipientAccountNumber },
      });
    });
  });

  describe('getRecipientsByUserId', () => {
    test('should get recipients for a specific user', async () => {
      const userId = 1;
      const recipientsData = [
        {
          recipientId: 1,
          userId,
          recipientAccountNumber: '1234567890',
          recipientName: 'Recipient 1',
        },
        {
          recipientId: 2,
          userId,
          recipientAccountNumber: '9876543210',
          recipientName: 'Recipient 2',
        },
      ];

      // Simular el método findAll del modelo Recipient
      Recipient.findAll = jest.fn().mockResolvedValue(recipientsData);

      // Llamar al método getRecipientsByUserId del servicio
      const recipients = await recipientService.getRecipientsByUserId(userId);

      // Verificar que el método Recipient.findAll fue llamado con el userId
      expect(Recipient.findAll).toHaveBeenCalledWith({
        where: { userId },
      });

      // Verificar que el resultado contiene los destinatarios correctos
      expect(recipients).toEqual(recipientsData);
    });
  });
});
