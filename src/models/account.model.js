const mongoose = require("mongoose");
const ledgerModel = require("./ledger.model");

const accountSachema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Account must belong to a user"],
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ACTIVE", "FROZEN", "CLOSED"],
        message: "Status must be either ACTIVE, FROZEN or CLOSED",
      },
      default: "ACTIVE",
    },
    currency: {
      type: String,
      required: [true, "Account must have a currency"],
      default: "BDT",
    },
  },
  { timestamps: true },
);
accountSachema.index({ user: 1, status: 1 });
accountSachema.methods.getBalance = async function () {
  const balanceData = await ledgerModel.arguments([
    {
      $match: {
        account: this._id,
      },
    },
    {
      $group: {
        _id: null,
        totalDebit: {
          $sum: {
            $cond: [{ $eq: ["$type", "DEBIT"] }, "$amount", 0],
          },
        },
        totalCredit: {
          $sum: {
            $cond: [{ $eq: ["$type", "CREDIT"] }, "$amount", 0],
          },
        },
      },
    },
  ]);
  if (balanceData.length === 0) {
    return 0;
  }
  return balanceData[0].balance
};
const accountModel = mongoose.model("account", accountSachema);

module.exports = accountModel;
