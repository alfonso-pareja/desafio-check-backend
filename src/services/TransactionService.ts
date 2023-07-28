import { CreateTransactionDto } from "../dtos/CreateTransactionDto";
import { Transaction } from "../models/Transaction";
import { Account } from "../models/Account";

export class TransactionService {
  async createTransaction(transactionData: CreateTransactionDto, tst?: boolean) {
    const { senderAccountNumber, receiverAccountNumber, amount } = transactionData;


     // Obtener las cuentas del sender y receiver por su número de cuenta
     const senderAccount = await Account.findOne({ where: { accountNumber: senderAccountNumber } });
     const receiverAccount = await Account.findOne({ where: { accountNumber: receiverAccountNumber } });
 
    if (!senderAccount) {
      throw new Error("Cuenta del emisor no encontrada.");
    }

    if (!receiverAccount) {
      throw new Error("Cuenta del receptor no encontrada.");
    }

    // Validar que el sender y receiver sean diferentes cuentas
    if (senderAccount.accountId === receiverAccount.accountId) {
      throw new Error("No puedes transferir a tu misma cuenta.");
    }


    console.log(senderAccount.balance)

      // Validar que el sender tenga saldo suficiente
    if (senderAccount.balance < amount) {
      throw new Error("Saldo insuficiente para realizar la transferencia.");
    }

    // Registrar la transferencia
    const newTransaction = await Transaction.create({
      senderAccountId: senderAccount.accountId,
      receiverAccountId: receiverAccount.accountId,
      amount: amount,
      transactionNumber: this.numberTransaction,
      status: "DONE",
    });

    // Actualizar el saldo de la cuenta del sender y receiver
    senderAccount.balance   -= Number(amount);
    receiverAccount.balance += Number(amount);
    if(!tst){
      await Account.update({ balance: senderAccount.balance }, { where: { accountId: senderAccount.accountId } });
      await Account.update({ balance: receiverAccount.balance }, { where: { accountId: receiverAccount.accountId } });
    }      

    return { ...newTransaction.dataValues, balance: senderAccount.balance  };
  }

  get numberTransaction(): number {
    return Math.floor(Math.random() * 9000000000) + 1000000000;
  }
}
