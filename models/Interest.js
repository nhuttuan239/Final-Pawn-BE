const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const interestSchema = Schema({
  interestType: { type: String, require: true },
  interestCode: { type: String, require: true },
  description: { type: String, required: false, default: "" },
  dateStart: { type: Number, required: true },
  dateEnd: { type: Number, required: true },

  interest: { type: Number, required: true, default: 0 },
  isDeleted: { type: Boolean, default: false },
});

const Interest = mongoose.model("Interest", interestSchema);
module.exports = Interest;
