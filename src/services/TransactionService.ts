import { CreateTransactionDto } from "../dtos/CreateTransactionDto";
import { Transaction } from "../models/Transaction";
import { Account } from "../models/Account";
import { User } from "../../src/models/User";


export class TransactionService {

  /**
   * Crea una nueva transaccion entre cuentas.
   * @param transactionData Los datos de la transaccion (cuenta de emisor, cuenta de receptor y monto).
   * @param tst (opcional) Si es true, la transaccion se crea en modo de prueba (no actualiza los saldos de las cuentas).
   * @returns La transaccion creada junto con el saldo actualizado del emisor.
   * @throws {Error} Si no se encuentran las cuentas del emisor o receptor, si el emisor y receptor son la misma cuenta,
   * si el emisor no tiene saldo suficiente para realizar la transaccion, o si ocurre un error al crear la transaccion.
   */
  async createTransaction(
    transactionData: CreateTransactionDto,
    tst?: boolean
  ): Promise<{ [key: string]: any }> {
    const { senderAccountNumber, receiverAccountNumber, amount } = transactionData;

    // Obtener las cuentas del emisor y receptor por su numero de cuenta
    const senderAccount = await Account.findOne({ where: { accountNumber: senderAccountNumber } });
    const receiverAccount = await Account.findOne({ where: { accountNumber: receiverAccountNumber } });
    const userReceiverAccount = await User.findOne({ where: { userId: receiverAccount.userId } });

    if (!senderAccount) {
      throw new Error("Cuenta del emisor no encontrada.");
    }

    if (!receiverAccount) {
      throw new Error("Cuenta del receptor no encontrada.");
    }

    // Validar que el emisor y receptor sean cuentas diferentes
    if (senderAccount.accountId === receiverAccount.accountId) {
      throw new Error("No puedes transferir a tu misma cuenta.");
    }

    // Validar que el emisor tenga saldo suficiente
    if (senderAccount.balance < amount) {
      throw new Error("Saldo insuficiente para realizar la transferencia.");
    }

    // Registrar la transaccion
    const newTransaction = await Transaction.create({
      senderAccountId: senderAccount.accountId,
      receiverAccountId: receiverAccount.accountId,
      receiverAccountName: userReceiverAccount.name,
      amount: amount,
      transactionNumber: this.numberTransaction,
      status: "DONE",
    });

    // Actualizar el saldo de las cuentas del emisor y receptor si no es modo de prueba (tst)
    if (!tst) {
      await Account.update({ balance: Number(senderAccount.balance) - Number(amount) }, { where: { accountId: senderAccount.accountId } });
      await Account.update({ balance: Number(receiverAccount.balance) + Number(amount) }, { where: { accountId: receiverAccount.accountId } });
    }

    return { ...newTransaction.dataValues, balance:  Number(receiverAccount.balance) - Number(amount) };
  }

  /**
   * Obtiene las transacciones realizadas por una cuenta especifica.
   * @param accountId El ID de la cuenta para la cual se obtienen las transacciones.
   * @param limit El numero maximo de transacciones a obtener.
   * @returns Un arreglo de objetos que representa las transacciones realizadas por la cuenta.
   */
  async getTransactionsByAccountId(accountId: number, limit: number): Promise<any[]> {
    const transactions = await Transaction.findAll({
      where: { senderAccountId: accountId },
      order: [["transactionDate", "DESC"]],
      limit,
    });

    return transactions;
  }

  /**
   * Genera un numero de transaccion aleatorio.
   * @returns Un numero de transaccion aleatorio.
   */
  get numberTransaction(): number {
    return Math.floor(Math.random() * 9000000000) + 1000000000;
  }
}
