const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const userSchema = Schema(
  {
    username: { type: String, require: true, unique: true },
    password: { type: String, required: true, select: false },
    email: { type: String, required: true },
    description: { type: String, required: false, default: "" },
    role: {
      type: String,
      required: true,
      enum: ["Admin", "Manager", "Employee"],
    },

    isDeleted: { type: Boolean, default: false },
    reportTo: this,
  },

  {
    timestamps: true,
  }
);

userSchema.methods.toJSON = function () {
  const user = this._doc;
  delete user.password;
  delete user.isDeleted;
  return user;
};

userSchema.methods.generateToken = async function () {
  const accessToken = await jwt.sign({ _id: this._id }, JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  return accessToken;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
