const mongoose = require("mongoose");
const { sendResponse, AppError } = require("../helpers/utils");
const { validationResult } = require("express-validator");
const User = require("../models/User");

const validators = {};

validators.validate = (validationArray) => async (req, res, next) => {
  await Promise.all(validationArray.map((validation) => validation.run(req)));
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const message = errors
    .array()
    .map((error) => error.msg)
    .join(" & ");

  return sendResponse(res, 422, false, null, { message }, "Validation Error");
};

validators.checkObjectId = (paramId) => {
  if (!mongoose.Types.ObjectId.isValid(paramId)) {
    throw new Error("Invalid ObjectId");
  }
  return true;
};

// validators.checkRole = (permission) => async (req, res, next) => {
//   const userId = req.userId;
//   console.log(req.userId);
//   const currentUser = await User.findById(userId);
//   console.log(currentUser);
//   if (currentUser.role !== "Manager") {
//     return sendResponse(
//       res,
//       400,
//       false,
//       null,
//       "Permission required",
//       "Update User Error"
//     );
//   } else {
//     next();
//   }
// };

validators.checkRole = (roles) => async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!roles.includes(user.role)) {
      throw new AppError(403, "Permission required", "Check Role Error");
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = validators;
