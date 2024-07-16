const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const billSchema = Schema({
  payDate: {
    type: Date,
    required: true,
  },
  authorCheck: { type: String, required: true, default: 0 },
  typePay: {
    type: String,
    required: true,
    enum: ["InterestPay", "TotalPay"],
  },
  payment: { type: Number, required: true, default: 0 },
  cnumber: { type: String, required: true },

  isDeleted: { type: Boolean, default: false },
});

const Bill = mongoose.model("Bill", billSchema);
module.exports = Bill;
