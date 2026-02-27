const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const accountmodel = require("../models/account.model");
const accountModel = require("../models/account.model");
const sendResponse = require("../utils/response");

const createTransaction = asyncHandler(async (req, res) => {
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

  // * 1️⃣ Validate input

  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    throw new AppError(
      "fromAccount, toAccount, amount and idempotencyKey are required",
      400,
    );
  }

  const fromAccoutn = await accountModel.findOne({
    _id: fromAccount,
  });
  const toAccoutn = await accountModel.findOne({
    _id: toAccount,
  });
  if (!fromAccoutn || !toAccoutn) {
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
  if (fromAccoutn.status !== "ACTIVE" || toAccoutn.status !== "ACTIVE") {
    throw new AppError(
      "Both accounts must be active to perform a transaction",
      400,
    );
  }
  
});
