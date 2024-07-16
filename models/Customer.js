const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customerSchema = Schema({
  fullname: { type: String, require: true },
  phone: { type: String, required: true, unique: true },
  nationalId: { type: String, required: true },
  address: { type: String, default: "" },

  isDeleted: { type: Boolean, default: false, select: false },
  createBy: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: "User",
  },
});

const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;
