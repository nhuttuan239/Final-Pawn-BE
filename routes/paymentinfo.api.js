const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const { body, param } = require("express-validator");
const validators = require("../middlewares/validators");
const authentication = require("../middlewares/authentication");

/**------------------ Put Payment Info for Contract -----------------------
 * @route PUT /payments
 * @description Get Payment info
 * @access Login required, Role: Manager & Employee
 */
router.put(
  "/:id",
  authentication.loginRequired,
  validators.checkRole(["Manager", "Employee"]),

  paymentController.putInfoPayment
);

/**------------------ Create Bill for Contract -----------------------
 * @route POST /payments/bill/:id
 * @description Create bill for contract
 * @access Login required, Role: Manager & Employee
 */
router.post(
  "/bill/:id",
  authentication.loginRequired,
  validators.checkRole(["Manager", "Employee"]),

  paymentController.createBill
);

/**------------------ Get Bills for Contract -----------------------
 * @route GET/payments/bills/:id
 * @description Get all bills for contract
 * @access Login required, Role: Manager & Employee
 */
router.get(
  "/bills/:id",
  authentication.loginRequired,
  validators.checkRole(["Manager", "Employee"]),

  paymentController.getAllBills
);

/**------------------ Delete Bill for Contract -----------------------
 * @route DELETE/payments/bill/:id
 * @description Delete Bill for single contract
 * @access Login required, Role: Manager & Employee
 */
router.delete(
  "/bill/:id",
  authentication.loginRequired,
  validators.checkRole(["Manager", "Employee"]),

  paymentController.deleteBill
);

module.exports = router;
