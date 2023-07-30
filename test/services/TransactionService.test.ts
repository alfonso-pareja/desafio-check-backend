import { User } from '../../src/models/User';
import { CreateTransactionDto } from '../../src/dtos/CreateTransactionDto';
import { Account } from '../../src/models/Account';
import { Transaction } from '../../src/models/Transaction';
import { TransactionService } from '../../src/services/TransactionService';
import { Sequelize } from 'sequelize-typescript';


describe('TransactionService', () => {
  let transactionService: TransactionService;
  let sequelizeMock: Sequelize;

  beforeEach(async () => {
    sequelizeMock = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      models: [User, Account, Transaction],
    });
    await sequelizeMock.sync({ force: true });
    transactionService = new TransactionService();
  });

  afterEach(async () => {
    await Promise.all([
      User.truncate({ cascade: true }),
      Account.truncate({ cascade: true }),
      Transaction.truncate({ cascade: true }),
    ]);
  });


  afterAll(async() => {
    jest.clearAllMocks();
    await sequelizeMock.close();
  });

  describe('createTransaction', () => {
    test('should create a new transaction and update balances', async () => {
      // Datos del sender de prueba
      const senderAccountNumber = '3807783189';
      const senderAccountBalance = 500;
      const senderAccountId = 8;

      // Datos del receiver de prueba
      const receiverAccountNumber = '0987654321';
      const receiverAccountBalance = 500;
      const receiverAccountId = 9;

      // Datos de la transacción de prueba
      const transactionData: CreateTransactionDto = {
        senderAccountNumber,
        receiverAccountNumber,
        amount: 100,
      };

      // Configuramos el mock para el método findOne del modelo Account
      Account.findOne = jest.fn().mockImplementation((options: any) => {
        // Dependiendo del número de cuenta, retornamos los datos correspondientes
        if (options.where?.accountNumber === senderAccountNumber) {
          return Promise.resolve({
            userId: '1',
            accountId: senderAccountId,
            accountNumber: senderAccountNumber,
            balance: senderAccountBalance,
          });
        } else if (options.where?.accountNumber === receiverAccountNumber) {
          return Promise.resolve({
            userId: '1',
            accountId: receiverAccountId,
            accountNumber: receiverAccountNumber,
            balance: receiverAccountBalance,
          });
        }
        return Promise.resolve(null);
      });


      // Simular el método create del modelo Transaction
      Transaction.create = jest.fn().mockResolvedValue({
        transactionId: 1,
        senderAccountId,
        receiverAccountId,
        amount: transactionData.amount,
        transactionNumber: 1234567890,
        status: 'DONE',
        createdAt: new Date(),
        updatedAt: new Date(),
        dataValues: {},
      });

      User.findOne = jest.fn().mockResolvedValue({
        userId: "1",
        name: 'User Test'
      })


      // Llamar al método createTransaction del servicio
      const createdTransaction = await transactionService.createTransaction(transactionData, true);

      // Verificar que el método findOne fue llamado con el número de cuenta del sender
      expect(Account.findOne).toHaveBeenCalledWith({ where: { accountNumber: senderAccountNumber } });

      // Verificar que el método findOne fue llamado con el número de cuenta del receiver
      expect(Account.findOne).toHaveBeenCalledWith({ where: { accountNumber: receiverAccountNumber } });

      // Verificar que el método create del modelo Transaction fue llamado
      expect(Transaction.create).toHaveBeenCalled();

      // Verificar la estructura de la transacción creada
      expect(createdTransaction).toEqual({ "balance": 400 });

    });

  });
});
