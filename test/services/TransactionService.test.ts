import { CreateTransactionDto } from '../../src/dtos/CreateTransactionDto';
import { Account } from '../../src/models/Account';
import { Transaction } from '../../src/models/Transaction';
import { TransactionService } from '../../src/services/TransactionService';

// Creamos un mock para el modelo Account
jest.mock('../../src/models/Account');
const mockedAccount = Account as jest.Mocked<typeof Account>;

// Creamos un mock para el modelo Transaction
jest.mock('../../src/models/Transaction');
const mockedTransaction = Transaction as jest.Mocked<typeof Transaction>;

describe('TransactionService', () => {
  let transactionService: TransactionService;

  beforeEach(() => {
    transactionService = new TransactionService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTransaction', () => {
    test('should create a new transaction and update balances', async () => {
      // Datos del sender de prueba
      const senderAccountNumber = '3807783189';
      const senderAccountBalance = 500;
      const senderAccountId = 8;

      // Datos del receiver de prueba
      const receiverAccountNumber = '0987654321';
      const receiverAccountBalance = 200;
      const receiverAccountId = 9;

      // Datos de la transacción de prueba
      const transactionData: CreateTransactionDto = {
        senderAccountNumber,
        receiverAccountNumber,
        amount: 100,
      };

      // Configuramos el mock para el método findOne del modelo Account
     mockedAccount.findOne = jest.fn().mockImplementation((options: any) => {
        // Dependiendo del número de cuenta, retornamos los datos correspondientes
        if (options.where?.accountNumber === senderAccountNumber) {
          return Promise.resolve({
            accountId: senderAccountId,
            accountNumber: senderAccountNumber,
            balance: senderAccountBalance,
          });
        } else if (options.where?.accountNumber === receiverAccountNumber) {
          return Promise.resolve({
            accountId: receiverAccountId,
            accountNumber: receiverAccountNumber,
            balance: receiverAccountBalance,
          });
        }
        return Promise.resolve(null);
      });


      // Simular el método create del modelo Transaction
      mockedTransaction.create = jest.fn().mockResolvedValue({
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

      // Llamar al método createTransaction del servicio
      const createdTransaction = await transactionService.createTransaction(transactionData, true);

      // Verificar que el método findOne fue llamado con el número de cuenta del sender
      expect(mockedAccount.findOne).toHaveBeenCalledWith({ where: { accountNumber: senderAccountNumber } });

      // Verificar que el método findOne fue llamado con el número de cuenta del receiver
      expect(mockedAccount.findOne).toHaveBeenCalledWith({ where: { accountNumber: receiverAccountNumber } });

      // Verificar que el método create del modelo Transaction fue llamado
      expect(mockedTransaction.create).toHaveBeenCalled();

      // Verificar la estructura de la transacción creada
      expect(createdTransaction).toEqual({ "balance": 400 });

    });

  });
});
