const Contract = require("../models/Contract");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");
const User = require("../models/User");
const Interest = require("../models/Interest");
const Customer = require("../models/Customer");
const { format } = require("date-fns/format");
const contractController = {};
const calculateContractCount = async () => {
  const contractCount = await Contract.countDocuments({
    isDeleted: false,
  });
};
//------------------------Create A New Contract --------------------------
contractController.createContract = catchAsync(async (req, res, next) => {
  //Get data from request
  const currentUserId = req.userId;
  console.log(currentUserId);
  const authorInfo = await User.findById(currentUserId);
  const authorName = authorInfo.username;

  const {
    fullname,
    nationalId,
    phone,
    address,
    interestType,
    product,
    description,
    price,
  } = req.body;
  const managerInfo = await User.findById(currentUserId).populate({
    path: "reportTo",
    model: "User",
  });

  const managerID = managerInfo.reportTo._id;

  const managerName = managerInfo.username;

  const managerId = managerInfo.reportTo._id;

  const newCustomer = await Customer.create({
    fullname,
    phone,
    nationalId,
    address,
    createBy: currentUserId,
  });

  const interests = await Interest.find({ interestType });

  const contractCount = await Contract.countDocuments({
    isDeleted: false,
  });
  const Count = contractCount + 1;
  const Cnumber3 = new Intl.NumberFormat("en-US", {
    minimumIntegerDigits: 3,
  }).format(Count);
  const CnumberType = interestType.slice(0, 3).toUpperCase();
  //Format Date
  const curtDate = new Date();

  const MM = new Intl.NumberFormat("en-US", {
    minimumIntegerDigits: 2,
  }).format(curtDate.getMonth() + 1);
  const dd = new Intl.NumberFormat("en-US", {
    minimumIntegerDigits: 2,
  }).format(curtDate.getDate());
  const yyyy = curtDate.getFullYear();
  const date = dd + "/" + MM + "/" + yyyy;
  const CnumberDate = dd + MM + yyyy;

  const cnumberAuto = `HD${Cnumber3}.${CnumberType}${CnumberDate}`;

  // Create a new contract
  let newContract = await Contract.create({
    author: currentUserId,
    authorName: authorName,
    manager: managerID,
    fullname: fullname,
    phone: phone,
    nationalId: nationalId,
    address: address,
    interestType: interestType,
    interests: interests,
    product: product,
    cnumber: cnumberAuto,
    description: description,
    price: price,
    createDate: curtDate,
  });

  //Response
  return sendResponse(
    res,
    200,
    true,
    newContract,
    null,
    "Create Contract Successful"
  );
});

//------------------------Update Contract --------------------------
contractController.updateContract = catchAsync(async (req, res, next) => {
  //Get data from request
  const targetContractId = req.params.id;
  const currentUserId = req.userId;
  // Business Logic Validation
  let contract = await Contract.findOne({
    isDeleted: false,
    _id: targetContractId,
    $or: [{ author: currentUserId }, { manager: currentUserId }],
  });

  if (!contract)
    throw new AppError(401, "Contract not found", "Get Current Contract Error");
  // Process
  const allows = [
    "fullname",
    "phone",
    "address",
    "nationalId",
    "interestType",
    "product",
    "description",
    "price",
  ];
  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      contract[field] = req.body[field];
    }
  });

  await contract.save();
  //Response
  sendResponse(
    res,
    200,
    true,
    contract,
    null,
    "Update Single Contract Successful"
  );
});

//------------------------Delete Contract --------------------------

contractController.deleteContract = catchAsync(async (req, res, next) => {
  //Get data from request
  const targetContractId = req.params.id;
  const currentUserId = req.userId;

  let contract = await Contract.findOneAndUpdate(
    {
      _id: targetContractId,
      $or: [{ author: currentUserId }, { manager: currentUserId }],
    },
    { isDeleted: true },
    { new: true }
  );

  if (!contract)
    throw new AppError(
      401,
      "Contract not found or Contract not authorize",
      "Delete Contract Error"
    );

  //Response
  return sendResponse(
    res,
    200,
    true,
    contract,
    null,
    "Delete Contract Successful"
  );
});

//--------------- Get Single Contract -----------------------
contractController.getSingleContract = catchAsync(async (req, res, next) => {
  //Get data from request
  const targetContractId = req.params.id;
  const currentUserId = req.userId;
  // Business Logic Validation
  let contract = await Contract.findOne({
    isDeleted: false,
    _id: targetContractId,
    $or: [{ author: currentUserId }, { manager: currentUserId }],
  });

  if (!contract)
    throw new AppError(401, "Contract not found", "Get Current Contract Error");

  //Response
  sendResponse(
    res,
    200,
    true,
    contract,
    null,
    "Get Single Contract Successful"
  );
});

//------------------------ Get Contract Manager --------------------------
contractController.getManagerContracts = catchAsync(async (req, res, next) => {
  //Get data from request
  const currentUserId = req.userId;
  const user = await User.findById(currentUserId);
  if (!user)
    throw new AppError(401, "User not found", "Get Current User Error");

  let { page, limit, ...filter } = { ...req.query };
  // Business Logic Validation
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  // Process
  const filterConditions = [
    { isDeleted: false },
    { $or: [{ author: currentUserId }, { manager: currentUserId }] },
  ];
  if (filter.name) {
    filterConditions.push({ name: { $regex: filter.name, $options: "i" } });
  }

  let filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};
  const count = await Contract.countDocuments(filterCriteria);
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  let contracts = await Contract.find(filterCriteria)
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);

  //Response
  sendResponse(
    res,
    200,
    true,
    { contracts, totalPages, count },
    null,
    "Get contracts successful"
  );
});

module.exports = contractController;
