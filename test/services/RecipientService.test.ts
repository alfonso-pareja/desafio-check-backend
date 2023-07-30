import { User } from "../../src/models/User";
import { CreateRecipientDto } from "../../src/dtos/CreateRecipientDto";
import { Recipient } from "../../src/models/Recipient";
import { RecipientService } from "../../src/services/RecipientService";
import { Sequelize } from "sequelize-typescript";
import { Account } from "../../src/models/Account";

describe('RecipientService', () => {
  let recipientService: RecipientService;
  let sequelizeMock: Sequelize;

  beforeEach(async () => {
    sequelizeMock = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      models: [User, Account, Recipient],
    });
    await sequelizeMock.sync({ force: true });
    recipientService = new RecipientService();
  });

  afterEach(async () => {
    await Promise.all([
      User.truncate({ cascade: true }),
      Account.truncate({ cascade: true }),
      Recipient.truncate({ cascade: true }),
    ]);
  });


  afterAll(async() => {
    jest.clearAllMocks();
    await sequelizeMock.close();
  });

  describe('createRecipient', () => {
    test('should create a new recipient', async () => {
      // Datos del destinatario de prueba
      const recipientData: CreateRecipientDto = {
        userId: "1",
        recipientAccountNumber: '1234567890',
        recipientName: 'Recipient Test',
      };

      Account.findOne  = jest.fn().mockResolvedValue({
        accountNumber: "1"
      });
      Recipient.create = jest.fn().mockResolvedValue({
        recipientId: 1,
        ...recipientData,
      });
      Recipient.findOne = jest.fn().mockResolvedValue(null);

      // Llamar al método createRecipient del servicio
      const createdRecipient = await recipientService.createRecipient(recipientData);

      // Verificar que el método Recipient.findOne fue llamado con los datos del destinatario
      expect(Recipient.findOne).toHaveBeenCalledWith({
        where: { recipientAccountNumber: recipientData.recipientAccountNumber, userId: recipientData.userId },
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
      Recipient.findOne  = jest.fn().mockResolvedValue({
        recipientId: 1,
        ...recipientData,
      });

      // Llamar al método createRecipient del servicio y verificar que lance un error
      await expect(recipientService.createRecipient(recipientData)).rejects.toThrowError(
        'Ya existe este destinatario para el usuario.'
      );

      // Verificar que el método Recipient.findOne fue llamado con los datos del destinatario
      expect(Recipient.findOne).toHaveBeenCalledWith({
        where: { recipientAccountNumber: recipientData.recipientAccountNumber, userId: recipientData.userId },
      });
    });
  });


});
