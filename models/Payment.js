const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = Schema({
  authorCheckPayment: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  customer: { type: String, required: true },
  createDate: {
    type: Date,
    required: true,
  },

  payDate: {
    type: Date,
    required: true,
  },
  cnumber: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  lastPaidDate: {
    type: Date,
  },
  totalDaysForPay: { type: Number, required: true, default: 0 },
  interestRate: { type: Number, required: true, default: 0 },
  interestPayment: { type: Number, required: true, default: 0 },
  totalPayment: { type: Number, required: true, default: 0 },
  historyPayment: { type: Array, default: [] },

  isDeleted: { type: Boolean, default: false },
});

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
