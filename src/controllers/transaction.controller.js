const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const accountmodel = require("../models/account.model");
const accountModel = require("../models/account.model");
const sendResponse = require("../utils/response");
const mongoose = require("mongoose");
const { sendTransactionEmail } = require("../services/email.service");
const createTransaction = asyncHandler(async (req, res) => {
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

  // * 1️⃣ Validate input

  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    throw new AppError(
      "fromAccount, toAccount, amount and idempotencyKey are required",
      400,
    );
  }

  const fromUserAccount = await accountModel.findOne({
    _id: fromAccount,
  });
  const toUserAccount = await accountModel.findOne({
    _id: toAccount,
  });
  if (!fromUserAccount || !toUserAccount) {
    throw new AppError("Invalid fromAccount or toAccount", 400);
  }

  // * 2️⃣ Check if transaction with the same idempotency key already exists

  const isTransactionAlreadyExists = await transactionModel.findOne({
    idempotencyKey,
  });

  if (isTransactionAlreadyExists) {
    const statusHandler = {
      COMPLETED: () =>
        sendResponse(res, 200, "Transaction already completed", {
          transaction: isTransactionAlreadyExists,
        }),

      PENDING: () =>
        sendResponse(res, 200, "Transaction is still pending", {
          transaction: isTransactionAlreadyExists,
        }),

      FAILED: () => {
        throw new AppError(
          "Transaction processing failed. Please try again.",
          500,
        );
      },
      REVERSED: () => {
        throw new AppError("Transaction was reversed. Please try again.", 500);
      },
    };

    const handler = statusHandler[isTransactionAlreadyExists.status];

    if (handler) return handler();
    // ✅ If status not found → throw error
    if (!handler) {
      throw new AppError(
        `Invalid transaction status: ${isTransactionAlreadyExists.status}`,
        400,
      );
    }

    return handler();
  }
  // * 3️⃣ Check account status
  if (
    fromUserAccount.status !== "ACTIVE" ||
    toUserAccount.status !== "ACTIVE"
  ) {
    throw new AppError(
      "Both accounts must be active to perform a transaction",
      400,
    );
  }
  // * 4️⃣ Driven sender balance form leger
  const balance = await fromUserAccount.getBalance();
  if (balance < amount) {
    throw new AppError(
      `Insufficient balance in sender's account. Current balance is this ${balance}. Requested  ammount is ${amount}`,
      400,
    );
  }
  // * 5️⃣ Create transaction with PENDING status
  const session = await mongoose.startSession();
  session.startTransaction();
  const transaction = await transactionModel.create(
    {
      fromAccount,
      toAccount,
      amount,
      idempotencyKey,
      status: "PENDING",
    },
    { session },
  );
  const creditLedgerEntry = await ledgerModel.create(
    {
      account: toAccount,
      type: "CREDIT",
      amount,
      transaction: transaction._id,
    },
    { session },
  );
  const debitLedgerEntry = await ledgerModel.create(
    {
      account: fromAccount,
      type: "DEBIT",
      amount,
      transaction: transaction._id,
    },
    { session },
  );
  transaction.status = "COMPLETED";
  await transaction.save({ session });
  await session.commitTransaction();
  session.endSession();

  // * 6️⃣ send Email notification to both sender and receiver (Optional)
  await sendTransactionEmail(req.user.email, req.user.name, amount, toAccount);
  sendResponse(res, 200, "Transaction completed successfully", {
    transaction,
  });
});

module.exports = {
  createTransaction,
};
