const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { formatISO } = require("date-fns");

const contractSchema = Schema({
  author: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  authorName: { type: String, required: true },
  manager: { type: String, required: true },

  fullname: { type: String, required: true },
  phone: { type: String, required: true },
  nationalId: { type: String, required: true },
  address: { type: String, required: true },
  interestType: { type: String, required: true },
  interests: { type: Array, required: true },

  cnumber: { type: String, required: true },
  createDate: {
    type: Date,
    required: true,
    immutable: true,
  },
  product: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  status: {
    type: String,
    required: true,
    enum: ["Active", "Expired", "Done"],
    default: "Active",
  },

  isDeleted: { type: Boolean, default: false },
});

const Contract = mongoose.model("Contract", contractSchema);
module.exports = Contract;
