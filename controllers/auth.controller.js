const { AppError, catchAsync, sendResponse } = require("../helpers/utils");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const authController = {};
authController.loginWithUsername = catchAsync(async (req, res, next) => {
  //Get data form req
  const { username, password } = req.body;

  // Business Logic Validation
  const user = await User.findOne({ username }, "+password");
  if (!user) throw new AppError(400, "Invalid Credentials", "Login Error");

  //Process
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError(400, "Invalid Credentials", "Login Error");
  const accessToken = await user.generateToken();

  //Response
  sendResponse(res, 200, true, { user, accessToken }, null, "Login succesfull");
});

module.exports = authController;
