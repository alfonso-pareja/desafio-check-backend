import { AccountService } from '../../src/services/AccountService';
import { Account } from '../../src/models/Account';


jest.mock('../../src/models/Account');
const mockedAccount = Account as jest.Mocked<typeof Account>;

describe('AccountService', () => {
  let accountService: AccountService;

  beforeEach(() => {
    accountService = new AccountService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createAccount', () => {
    test('should create a new account and associate it with the user', async () => {
      // Datos de prueba
      const userId = 112;
      const generatedAccountNumber = '3994111500';

      // Configurar el mock para el método create del modelo Account
      mockedAccount.create = jest.fn().mockResolvedValue({
        accountId: 1,
        accountNumber: generatedAccountNumber,
        balance: 0,
        bank: 'Banco Ripley',
        accountType: 'Cuenta Corriente',
        userId,
      });

      // Llamar al método createAccount del servicio
      const createdAccount = await accountService.createAccount(userId);

      // Verificar que el método create del modelo Account fue llamado
      expect(mockedAccount.create).toHaveBeenCalledWith({
        accountNumber: expect.any(String),
        balance: 0,
        bank: 'Banco Ripley',
        accountType: 'Cuenta Corriente',
        userId,
      });

      // Verificar que se devuelve la cuenta creada correctamente
      expect(createdAccount).toEqual({
        accountId: 1,
        accountNumber: generatedAccountNumber,
        balance: 0,
        bank: 'Banco Ripley',
        accountType: 'Cuenta Corriente',
        userId,
      });
    });

  });
});
