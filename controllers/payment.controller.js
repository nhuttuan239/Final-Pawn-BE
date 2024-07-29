const Contract = require("../models/Contract");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");
const User = require("../models/User");
const Interest = require("../models/Interest");
const Customer = require("../models/Customer");
const Payment = require("../models/Payment");
const { format, formatISO, parse } = require("date-fns");
const Bill = require("../models/Bill");

const paymentController = {};
const calculateContractCount = async () => {
  const paymentCount = await Contract.countDocuments({
    isDeleted: false,
  });
};
//------------------------Create A Single Contract Payment ------------------------//
paymentController.putInfoPayment = catchAsync(async (req, res, next) => {
  //Get data from request
  const currentUserId = req.userId;
  const payDate = req.body.payDate;

  const formatPayDate = new Date(payDate);

  const targetContractId = req.params.id;
  const contractCheck = await Contract.findById(targetContractId);
  const cnumberCheck = contractCheck.cnumber;

  const customerName = contractCheck.customerName;

  const createDate = contractCheck.createDate;

  const formatCreateDate = format(createDate, "dd/MM/yyyy");

  // Logic nearestpayDate
  // find bill with payDate nearest
  const nearestBill = await Bill.findOne({
    isDeleted: false,
    cnumber: cnumberCheck,
  })
    .sort({ payDate: -1 })
    .exec();
  console.log("nearestBill>>>>>>>", nearestBill);
  let nearPayDate;
  if (nearestBill) {
    nearPayDate = new Date(nearestBill.payDate);
  }

  let totalDays;
  if (nearestBill) {
    totalDays = Math.ceil(
      (formatPayDate - nearPayDate) / (1000 * 60 * 60 * 24)
    );
  } else {
    totalDays = Math.ceil((formatPayDate - createDate) / (1000 * 60 * 60 * 24));
  }

  const priceContract = contractCheck.price;

  let interestRateContract;
  // if totalDays <= dateEnd[2]

  if (totalDays <= contractCheck.interests[2].dateEnd) {
    totalDays <= contractCheck.interests[0].dateEnd
      ? (interestRateContract = contractCheck.interests[0].interest)
      : totalDays <= contractCheck.interests[1].dateEnd
      ? (interestRateContract = contractCheck.interests[1].interest)
      : (interestRateContract = contractCheck.interests[2].interest);
  }

  // if totalDays > dateEnd[2]
  else {
    let interest1 =
      (totalDays - (totalDays % contractCheck.interests[2].dateEnd)) /
      contractCheck.interests[2].dateEnd;
    console.log("interest1", interest1);
    let interest2 = totalDays % contractCheck.interests[2].dateEnd;
    console.log("interest2", interest2);
    let interestRateContract2;
    if (interest2 === 0) {
      interestRateContract2 = 0;
      interestRateContract =
        contractCheck.interests[2].interest * interest1 + interestRateContract2;
    } else {
      interest2 <= contractCheck.interests[0].dateEnd
        ? (interestRateContract2 = contractCheck.interests[0].interest)
        : interest2 <= contractCheck.interests[1].dateEnd
        ? (interestRateContract2 = contractCheck.interests[1].interest)
        : (interestRateContract2 = contractCheck.interests[2].interest);

      interestRateContract =
        contractCheck.interests[2].interest * interest1 + interestRateContract2;
    }
  }
  console.log("interestRateContract", interestRateContract);
  //   const lastPaidContractDate = new Date(); //Chua hieu logic

  const paymentforInterest = interestRateContract * priceContract;
  const totalPaymentContract = priceContract + paymentforInterest;

  const payment = {
    authorCheckPayment: currentUserId,
    customer: contractCheck.customerName,
    createDate: formatCreateDate,
    payDate: formatPayDate,
    cnumber: cnumberCheck,
    price: priceContract,
    totalDaysForPay: totalDays,
    interestRate: interestRateContract,
    interestPayment: paymentforInterest,
    totalPayment: totalPaymentContract,
  };

  return sendResponse(res, 200, true, payment, null, "Get Payment Successful");
});

//------------------------Create Bill for Contract --------------------------//
paymentController.createBill = catchAsync(async (req, res, next) => {
  //Get data from request
  const currentUserId = req.userId;
  const authorInfo = await User.findById(currentUserId);

  const typePay = req.body.typePay;

  const targetContractId = req.params.id;
  const contractCheck = await Contract.findById(targetContractId);
  const cnumberCheck = contractCheck.cnumber;

  const customerName = contractCheck.customerName;

  const createDate = contractCheck.createDate;

  const payDate = req.body.payDate;

  const formatPayDate = new Date(payDate);

  let totalDays =
    Math.ceil((formatPayDate - createDate) / (1000 * 60 * 60 * 24)) + 1;

  const priceContract = contractCheck.price;

  let interestRateContract;
  // if totalDays <= dateEnd[2]

  if (totalDays <= contractCheck.interests[2].dateEnd) {
    totalDays <= contractCheck.interests[0].dateEnd
      ? (interestRateContract = contractCheck.interests[0].interest)
      : totalDays <= contractCheck.interests[1].dateEnd
      ? (interestRateContract = contractCheck.interests[1].interest)
      : (interestRateContract = contractCheck.interests[2].interest);
  }

  // if totalDays > dateEnd[2]
  else {
    let interest1 =
      (totalDays - (totalDays % contractCheck.interests[2].dateEnd)) /
      contractCheck.interests[2].dateEnd;

    let interest2 = totalDays % contractCheck.interests[2].dateEnd;

    let interestRateContract2;
    if (interest2 === 0) {
      interestRateContract2 = 0;
      interestRateContract =
        contractCheck.interests[2].interest * interest1 + interestRateContract2;
    } else {
      interest2 <= contractCheck.interests[0].dateEnd
        ? (interestRateContract2 = contractCheck.interests[0].interest)
        : interest2 <= contractCheck.interests[1].dateEnd
        ? (interestRateContract2 = contractCheck.interests[1].interest)
        : (interestRateContract2 = contractCheck.interests[2].interest);

      interestRateContract =
        contractCheck.interests[2].interest * interest1 + interestRateContract2;
    }
  }

  //   const lastPaidContractDate = new Date(); //Chua hieu logic

  const paymentforInterest = interestRateContract * priceContract;
  const totalPaymentContract = priceContract + paymentforInterest;

  let selectedPayment;
  typePay === "InterestPay"
    ? (selectedPayment = paymentforInterest)
    : (selectedPayment = totalPaymentContract);

  let bill = await Bill.create({
    payDate: formatPayDate,
    authorCheck: authorInfo.username,
    typePay: typePay,
    payment: selectedPayment,
    cnumber: cnumberCheck,
  });

  return sendResponse(res, 200, true, bill, null, "Create Bill Successful");
});

//------------------------ Get All Bills For Single Contract ------------------------//
paymentController.getAllBills = catchAsync(async (req, res, next) => {
  let { page, limit, ...filter } = { ...req.query };
  console.log(filter.name);
  // Business Logic Validation
  const targetContractId = req.params.id;
  const contractCheck = await Contract.findById(targetContractId);
  const cnumberCheck = contractCheck.cnumber;

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  // Process
  const filterConditions = [{ cnumber: cnumberCheck, isDeleted: false }, {}];
  if (filter.name) {
    filterConditions.push({ fullname: { $regex: filter.name, $options: "i" } });
  }

  let filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};
  const count = await Bill.countDocuments(filterCriteria);
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  let bills = await Bill.find(filterCriteria)
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);

  //Response
  sendResponse(
    res,
    200,
    true,
    { bills, totalPages, count },
    null,
    "Get bills successful"
  );
});

//------------------------Delete Bill for Single Contract --------------------------

paymentController.deleteBill = catchAsync(async (req, res, next) => {
  //Get data from request
  const targetBillId = req.params.id;

  let bill = await Bill.findOneAndUpdate(
    { _id: targetBillId },
    { isDeleted: true },
    { new: true }
  );

  if (!bill)
    throw new AppError(
      401,
      "Bill not found or Bill not authorize",
      "Delete Bill Error"
    );

  //Response
  return sendResponse(res, 200, true, bill, null, "Delete Bill Successful");
});

//------------------------ Get Contract By Phone --------------------------

paymentController.getPhoneContract = catchAsync(async (req, res, next) => {
  //Get data from request
  const cnumber = req.body.cnumber;
  const cphone = req.body.cphone;
  // Business Logic Validation
  let contractCheck = await Contract.findOne({
    isDeleted: false,
    cnumber: cnumber,
    cphone: cphone,
  });

  if (!contractCheck)
    sendResponse(
      res,
      200,
      true,
      "Not found Contract match",
      null,
      "Get Contract by Phone Successful"
    );

  const cnumberCheck = contractCheck.cnumber;

  const customerName = contractCheck.customerName;

  const formatPayDate = new Date();
  const converPayDate = format(formatPayDate, "dd/MM/yyyy");
  const createDate = contractCheck.createDate;
  const formatCreateDate = format(createDate, "dd/MM/yyyy");

  // Logic nearestpayDate
  // find bill with payDate nearest
  const nearestBill = await Bill.findOne({
    isDeleted: false,
    cnumber: cnumberCheck,
  })
    .sort({ payDate: -1 })
    .exec();

  let nearPayDate;
  if (nearestBill) {
    nearPayDate = new Date(nearestBill.payDate);
  }

  let totalDays;
  if (nearestBill) {
    totalDays = Math.ceil(
      (formatPayDate - nearPayDate) / (1000 * 60 * 60 * 24)
    );
  } else {
    totalDays = Math.ceil((formatPayDate - createDate) / (1000 * 60 * 60 * 24));
  }

  const priceContract = contractCheck.price;

  let interestRateContract;
  // if totalDays <= dateEnd[2]

  if (totalDays <= contractCheck.interests[2].dateEnd) {
    totalDays <= contractCheck.interests[0].dateEnd
      ? (interestRateContract = contractCheck.interests[0].interest)
      : totalDays <= contractCheck.interests[1].dateEnd
      ? (interestRateContract = contractCheck.interests[1].interest)
      : (interestRateContract = contractCheck.interests[2].interest);
  }

  // if totalDays > dateEnd[2]
  else {
    let interest1 =
      (totalDays - (totalDays % contractCheck.interests[2].dateEnd)) /
      contractCheck.interests[2].dateEnd;

    let interest2 = totalDays % contractCheck.interests[2].dateEnd;

    let interestRateContract2;
    if (interest2 === 0) {
      interestRateContract2 = 0;
      interestRateContract =
        contractCheck.interests[2].interest * interest1 + interestRateContract2;
    } else {
      interest2 <= contractCheck.interests[0].dateEnd
        ? (interestRateContract2 = contractCheck.interests[0].interest)
        : interest2 <= contractCheck.interests[1].dateEnd
        ? (interestRateContract2 = contractCheck.interests[1].interest)
        : (interestRateContract2 = contractCheck.interests[2].interest);

      interestRateContract =
        contractCheck.interests[2].interest * interest1 + interestRateContract2;
    }
  }

  //   const lastPaidContractDate = new Date(); //Chua hieu logic

  const paymentforInterest = interestRateContract * priceContract;
  const totalPaymentContract = priceContract + paymentforInterest;

  const payment = {
    customer: contractCheck.customerName,
    createDate: formatCreateDate,

    payDate: converPayDate,
    cnumber: cnumberCheck,
    price: priceContract,
    totalDaysForPay: totalDays,
    interestRate: interestRateContract,
    interestPayment: paymentforInterest,
    totalPayment: totalPaymentContract,
    nearPayDate: nearPayDate,
  };

  return sendResponse(
    res,
    200,
    true,
    payment,
    null,
    "Get Payment by Phone Successful"
  );
});

//------------------------export Controller-------------------------//
module.exports = paymentController;
