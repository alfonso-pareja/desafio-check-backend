import { Account } from "../models/Account";

export class AccountService {
  /**
   * Crea una nueva cuenta para un usuario.
   * @param userId El ID del usuario para el cual se creara la cuenta.
   * @returns La cuenta creada.
   * @throws {Error} Si no se logra asociar la cuenta al usuario.
   */
  async createAccount(userId: number) {
    // Generar un numero de cuenta aleatorio de 10 digitos.
    const accountNumber = Math.floor(Math.random() * 9000000000) + 1000000000;
    const account = await Account.create({
      accountNumber: accountNumber.toString(),
      balance: 0,
      bank: "Banco Ripley",
      accountType: "Cuenta Corriente",
      userId
    });

    if (!account.accountId) {
      throw new Error("No se logró asociar la cuenta al usuario.");
    }

    return account;
  }
  
}
