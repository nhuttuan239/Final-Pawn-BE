const Customer = require("../models/Customer");
const { sendResponse, catchAsync, AppError } = require("../helpers/utils");

const customerController = {};

//------------------------Create A New Customer --------------------------
customerController.createNewCustomer = async (req, res, next) => {
  //Get data form req
  const currentUserId = req.userId;
  let { fullname, phone, nationalId, address } = req.body;

  // Business Logic Validation
  //check already exist
  let customer = await Customer.findOne({ phone });
  if (customer)
    throw new AppError(400, "Customer already exists", "Create Customer error");
  //Process

  customer = await Customer.create({
    fullname,
    phone,
    nationalId,
    address,
    createBy: currentUserId,
  });

  //Response
  sendResponse(
    res,
    200,
    true,
    customer,
    null,
    "Create A New Customer succesfull"
  );
};

//------------------------Update Single Customer --------------------------
customerController.updateCustomer = catchAsync(async (req, res, next) => {
  //Get data from request
  const targetCustomerId = req.params.id;

  let customer = await Customer.findById(targetCustomerId);
  if (!customer)
    throw new AppError(401, "Customer not found", "Get Current Customer Error");
  // Process
  const allows = ["fullname", "phone", "nationalId", "address"];
  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      customer[field] = req.body[field];
    }
  });

  await customer.save();
  //Response
  sendResponse(res, 200, true, customer, null, "Update Customer Successful");
});

//------------------------Delete Single Customer --------------------------

customerController.deleteCustomer = catchAsync(async (req, res, next) => {
  //Get data from request
  const targetCustomerId = req.params.id;

  let customer = await Customer.findOneAndUpdate(
    { _id: targetCustomerId },
    { isDeleted: true },
    { new: true }
  );

  if (!customer)
    throw new AppError(
      401,
      "Customer not found or Customer not authorize",
      "Delete Customer Error"
    );

  //Response
  return sendResponse(
    res,
    200,
    true,
    customer,
    null,
    "Delete Customer Successful"
  );
});

//------------------------Get All Customers --------------------------

customerController.getCustomers = catchAsync(async (req, res, next) => {
  //Get data from request

  let { page, limit, ...filter } = { ...req.query };

  // Business Logic Validation
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  // Process
  const filterConditions = [{ isDeleted: false }, {}];
  if (filter.name) {
    filterConditions.push({ fullname: { $regex: filter.name, $options: "i" } });
  }

  let filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};
  const count = await Customer.countDocuments(filterCriteria);
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  let customers = await Customer.find(filterCriteria)
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);

  //Response
  sendResponse(
    res,
    200,
    true,
    { customers, totalPages, count },
    null,
    "Get customers successful"
  );
});

module.exports = customerController;
