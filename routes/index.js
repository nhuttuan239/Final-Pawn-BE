var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send({ status: "ok", data: "Hello Pawnshop" });
});

//AuthApi
const AuthApi = require("./auth.api");
router.use("/auth", AuthApi);

//UserApi
const UserApi = require("./user.api");
router.use("/users", UserApi);

//CustomerApi
const CustomerApi = require("./customer.api");
router.use("/customers", CustomerApi);

//InterestApi
const InterestApi = require("./interest.api");
router.use("/interests", InterestApi);

//ContractApi
const ContractApi = require("./contract.api");
router.use("/contracts", ContractApi);

//PaymentApi
const PaymentApi = require("./paymentinfo.api");
router.use("/payments", PaymentApi);

//CheckApi
const CheckApi = require("./check.api");
router.use("/checks", CheckApi);

module.exports = router;
