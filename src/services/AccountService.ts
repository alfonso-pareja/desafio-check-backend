import { Account } from "../models/Account";

export class AccountService {
    
  async createAccount(userId: number) {
    const accountNumber = Math.floor(Math.random() * 9000000000) + 1000000000;
    const account = await Account.create({
      accountNumber: accountNumber.toString(),
      balance: 0,
      bank: "Banco Ripley",
      accountType: "Cuenta Corriente",
      userId
    });

    if (!account.accountId)
      throw new Error("No se logro asociar la cuenta al usuario.");

    return account;
  }
}
