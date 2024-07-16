const Contract = require("../models/Contract");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");
const User = require("../models/User");
const Interest = require("../models/Interest");
const Customer = require("../models/Customer");
const Bill = require("../models/Bill");
const { formatISO } = require("date-fns");
const History = require("../models/History");

const billController = {};
const calculateContractCount = async () => {
  const billCount = await Contract.countDocuments({
    isDeleted: false,
  });
};
//------------------------Create A New Bill ------------------------//
billController.createBill = catchAsync(async (req, res, next) => {
  //Get data from request
  const currentUserId = req.userId;
  const author = req.username;
  const { resPayDate } = req.body;
  const targetContractId = req.params.id;
  const contractCheck = await Contract.findById(targetContractId);
  const cnumberCheck = contractCheck.cnumber;

  // console.log(contractCheck);
  const customerId = contractCheck.customer;

  const customer = await Customer.findById(customerId);
  const customerName = customer.fullname;
  console.log("customer Name", customerName);
  //Format Date
  const formatPayDate = new Date(resPayDate);
  console.log("formatPayDate", formatPayDate);
  //   const customerName = contractCheck.customer.fullname;
  const createContractDate = new Date(contractCheck.createDate);
  console.log("createContractDate", createContractDate);
  let totalDays =
    Math.ceil((formatPayDate - createContractDate) / (1000 * 60 * 60 * 24)) + 1;

  console.log("totalDays", totalDays);

  const priceContract = contractCheck.price;
  console.log("priceContract", priceContract);

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
  // Create History
  let history = await History.create({
    lastPayDate: formatPayDate,
    authorCheck: author,
    typePayment: "interestPayment",
    payment: paymentforInterest,
    cnumber: cnumberCheck,
  });
  //
  const historyBills = await History.find({ cnumber: cnumberCheck });
  const lastPaidContractDate =
    historyBills[historyBills.length - 1].lastPayDate;
  console.log("lastPaidContractDate", lastPaidContractDate);
  // Create bill
  let bill = await Bill.create({
    authorCheckBill: currentUserId,
    customer: customerName,
    createDate: createContractDate,
    lastPaidDate: lastPaidContractDate,
    payDate: formatPayDate,
    cnumber: cnumberCheck,
    price: priceContract,
    totalDaysForPay: totalDays,
    interestRate: interestRateContract,
    interestPayment: paymentforInterest,
    totalPayment: totalPaymentContract,
    historyBill: historyBills,
  });

  //   //Response
  return sendResponse(res, 200, true, bill, null, "Create Bill Successful");
});

//------------------------Delete Bill --------------------------//
billController.deleteBill = catchAsync(async (req, res, next) => {});

//------------------------ Get All Bills For Single Contract ------------------------//
billController.getBills = catchAsync(async (req, res, next) => {});
module.exports = billController;
