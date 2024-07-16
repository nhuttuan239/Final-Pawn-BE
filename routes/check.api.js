const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");

const authentication = require("../middlewares/authentication");

/**------------------- Get Contract for Customer ----------------
 * @route GET /contracts?cphone=0919778899&cnumber=00001
 * @description Get a single contract with query
 */
router.put("/", paymentController.getPhoneContract);

module.exports = router;
