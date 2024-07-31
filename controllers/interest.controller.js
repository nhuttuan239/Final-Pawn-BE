const Interest = require("../models/Interest");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");
const User = require("../models/User");

const interestController = {};

//------------------------Create A New Interest --------------------------
interestController.createNewInterest = async (req, res, next) => {
  //Get data form req
  let {
    interestType,
    interestCode,
    description,
    dateStart,
    dateEnd,
    interest,
  } = req.body;

  // Business Logic Validation
  //check already exist
  try {
    let interestRate = await Interest.findOne({
      interestCode,
      isDeleted: false,
    });
    if (interestRate) {
      return sendResponse(
        res,
        200,
        true,
        interestRate,
        null,
        "Interest already exists"
      );
    }
    //Process

    interestRate = await Interest.create({
      interestType,
      interestCode,
      description,
      dateStart,
      dateEnd,
      interest,
    });

    //Response
    return sendResponse(
      res,
      200,
      true,
      interestRate,
      null,
      "Create A New Interest succesfull"
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//------------------------Update Interest --------------------------
interestController.updateInterest = catchAsync(async (req, res, next) => {
  //Get data from request
  const targetInterestId = req.params.id;

  let interest = await Interest.findById(targetInterestId);
  if (!interest)
    throw new AppError(401, "Interest not found", "Get Current Interest Error");
  // Process
  const allows = [
    "interestType",
    "interestCode",
    "description",
    "dateStart",
    "dateEnd",
    "interest",
  ];
  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      interest[field] = req.body[field];
    }
  });

  await interest.save();
  //Response
  sendResponse(res, 200, true, interest, null, "Update Interest Successful");
});

//------------------------Delete Interest --------------------------
interestController.deleteInterest = catchAsync(async (req, res, next) => {
  //Get data from request
  const targetInterestId = req.params.id;

  let interest = await Interest.findOneAndUpdate(
    { _id: targetInterestId },
    { isDeleted: true },
    { new: true }
  );

  if (!interest)
    throw new AppError(
      401,
      "Interest not found or Interest not authorize",
      "Delete Interest Error"
    );

  //Response
  return sendResponse(
    res,
    200,
    true,
    interest,
    null,
    "Delete Interest Successful"
  );
});

//------------------------Get All Interest --------------------------

interestController.getInterest = catchAsync(async (req, res, next) => {
  //Get data from request
  const currentUserId = req.userId;
  const user = await User.findById(currentUserId);
  if (!user) throw new AppError(401, "User not found", "Get Interests Error");

  let { page, limit, ...filter } = { ...req.query };
  // Business Logic Validation
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  // Process
  const filterConditions = [{ isDeleted: false }];
  if (filter.name) {
    filterConditions.push({ name: { $regex: filter.name, $options: "i" } });
  }

  let filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};
  const count = await Interest.countDocuments(filterCriteria);
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  let interests = await Interest.find(filterCriteria)
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);

  //Response
  sendResponse(
    res,
    200,
    true,
    { interests, totalPages, count },
    null,
    "Get interests successful"
  );
});

module.exports = interestController;
