const mongoose = require("mongoose");

const accountSachema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true, "Account must belong to a user"],
    index: true,
  },
  status: {
    enum: {
      values: ["ACTIVE", "FROZEN", "CLOSED"],
      message: "Status must be either ACTIVE, FROZEN or CLOSED",
    },
  },
  currency: {
    type: String,
    required: [true, "Account must have a currency"],
    default: "BDT",
  },
  timestamps: true
});
accountSachema.index({ user: 1,status: 1 });

const accountModel = mongoose.model("account", accountSachema);

module.exports = accountModel;
