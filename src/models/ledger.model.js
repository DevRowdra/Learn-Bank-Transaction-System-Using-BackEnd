const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "account",
    required: [true, "Ledger entry must be associated with an account"],
    index: true,
    inmutable: true,
  },
  amount: {
    type: Number,
    required: [true, "Amount is required for creating a ledger entry"],
    inmutable: true,
  },
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "transaction",
    required: [true, "Ledger entry must be associated with a transaction"],
    index: true,
    inmutable: true,
  },
  type: {
    type: String,
    enum: {
      values: ["DEBIT", "CREDIT"],
      default: "DEBIT",
      message: "Type must be either DEBIT or CREDIT",
    },
    required: [true, "Ledger entry must have a type"],
    immutable: true,
  },
});

function prventLedgerModification() {
  throw new Error("Ledger entries cannot be modified or deleted");
}

ledgerSchema.pre("findOneAndUpdate", prventLedgerModification);
ledgerSchema.pre("findOneAndDelete", prventLedgerModification);
ledgerSchema.pre("updateOne", prventLedgerModification);
ledgerSchema.pre("deleteOne", prventLedgerModification);
ledgerSchema.pre("deleteMany", prventLedgerModification);
ledgerSchema.pre("updateMany", prventLedgerModification);
ledgerSchema.pre("remove", prventLedgerModification);
ledgerSchema.pre("findOneAndReplace", prventLedgerModification);

const ledgerModel = mongoose.model("ledger", ledgerSchema);
module.exports = ledgerModel;
