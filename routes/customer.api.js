const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customer.controller");
const { body, param } = require("express-validator");
const validators = require("../middlewares/validators");
const authentication = require("../middlewares/authentication");

/**------------------ Create New Customer ------------------
 * @route POST /customer
 * @description Create a new customer
 * @body {username, password, description}
 * @access Login required, role: Manager, Emplpyee
 */
router.post(
  "/",
  validators.validate([
    body("fullname", "Invalid Name").notEmpty(),
    body("phone").exists().notEmpty(),

    body("nationalId").exists().notEmpty(),
    body("address").exists().notEmpty(),
    body("createBy").exists().isString().custom(validators.checkObjectId),
  ]),
  authentication.loginRequired,
  validators.checkRole(["Manager", "Employee"]),
  customerController.createNewCustomer
);

/**----------------- Update Customer ------------------------
 * @route PUT /customer/:id
 * @description Update customer profile
 * @body {username, password, description}
 * @access Login required, role: Manager
 */
router.put(
  "/:id",
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  authentication.loginRequired,
  validators.checkRole(["Manager"]),
  customerController.updateCustomer
);

/**-------------- Delete Customer ---------------------------
 * @route DELETE /customer/:id
 * @description Delete a customer
 * @access Login required,role: Manager
 */
router.delete(
  "/:id",
  authentication.loginRequired,
  validators.checkRole(["Manager"]),

  customerController.deleteCustomer
);

/**------------------- Get All Customer ----------------------
 * @route GET /users?page=1&limit=10
 * @description Get all users with pagination
 * @access Login required, role: only Manager
 */
router.get(
  "/",
  authentication.loginRequired,
  validators.checkRole(["Manager"]),
  customerController.getCustomers
);
module.exports = router;
