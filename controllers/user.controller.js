const User = require("../models/User");
const { sendResponse, catchAsync, AppError } = require("../helpers/utils");
const bcrypt = require("bcryptjs");

const userController = {};

//------------------------Get CurrentUser --------------------------

userController.getCurrentUser = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  // Business Logic Validation
  const user = await User.findById(currentUserId);
  // .populate({
  //   path: "reportTo",
  //   model: "User",
  // })
  // .exec();
  if (!user)
    throw new AppError(401, "User not found", "Get Current User Error");
  // Process

  //Response
  sendResponse(res, 200, true, user, null, "Get current user successful");
});

//------------------------Update CurrentUser --------------------------

userController.updateCurrentUser = catchAsync(async (req, res, next) => {
  //Get data from request
  const currentUserId = req.userId;

  let user = await User.findById(currentUserId);
  if (!user)
    throw new AppError(401, "User not found", "Get Current User Error");
  // Process
  const allows = ["username", "password", "email", "description"];
  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });

  await user.save();

  //Response
  sendResponse(res, 200, true, user, null, "Update Your Profile Successful");
});

//------------------------Get All Users --------------------------

userController.getUsers = catchAsync(async (req, res, next) => {
  //Get data from request

  let { ...filter } = { ...req.query };
  // Business Logic Validation
  // page = parseInt(page) || 1;
  // limit = parseInt(limit) || 10;
  // Process
  const filterConditions = [{ isDeleted: false }];
  if (filter.name) {
    filterConditions.push({ name: { $regex: filter.name, $options: "i" } });
  }

  let filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};
  const count = await User.countDocuments(filterCriteria);
  // const totalPages = Math.ceil(count / limit);
  // const offset = limit * (page - 1);

  let users = await User.find(filterCriteria)
    .sort({ createdAt: -1 })
    .skip(offset);
  //Response
  sendResponse(res, 200, true, { users, count }, null, "Get users successful");
});

//------------------------Create a new User --------------------------

userController.createUser = catchAsync(async (req, res, next) => {
  //Get data form req
  let { username, email, password, description, role, reportTo } = req.body;

  // Business Logic Validation
  //check already exist
  let user = await User.findOne({ username });
  if (user) throw new AppError(400, "User already exists", "Create user error");
  //Process

  //crypt password
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);

  user = await User.create({
    username,
    email,
    password,
    description,
    role,
    reportTo,
  });

  //Response
  sendResponse(res, 200, true, user, null, "Create user succesfull");
});

//------------------------Update Single User --------------------------
userController.updateUser = catchAsync(async (req, res, next) => {
  //Get data from request
  const targetUserId = req.params.id;

  let user = await User.findById(targetUserId);

  if (!user)
    throw new AppError(401, "User not found", "Get Current User Error");
  // Process
  const allows = ["username", "email", "description", "role", "reportTo"];
  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });

  await user.save();
  //Response
  sendResponse(res, 200, true, user, null, "Update User Successful");
});

//------------------------Delete Single User --------------------------

userController.deleteUser = catchAsync(async (req, res, next) => {
  //Get data from request
  const targetUserId = req.params.id;

  let user = await User.findOneAndUpdate(
    { _id: targetUserId },
    { isDeleted: true },
    { new: true }
  );

  if (!user)
    throw new AppError(
      401,
      "User not found or User not authorize",
      "Delete User Error"
    );

  //Response
  return sendResponse(res, 200, true, user, null, "Delete User Successful");
});

module.exports = userController;
