const express = require("express");
const router = express.Router();
const contractController = require("../controllers/contract.controller");
const { body, param } = require("express-validator");
const validators = require("../middlewares/validators");
const authentication = require("../middlewares/authentication");

/**------------------ Create New Contract -----------------------
 * @route POST /contracts
 * @description Create a new contract
 * @body {Cnumber, full name, phone, product, description, value, create-date }
 * @access Login required, Role: Manager & Employee
 */
router.post(
  "/",
  authentication.loginRequired,
  validators.checkRole(["Manager", "Employee"]),
  validators.validate([
    body("interestType", "Invalid interestType").isString(),
    body("product", "Missing Product").isString().notEmpty(),
    body("description", "Missing Description").isString().notEmpty(),
    body("price", "Missing price").isNumeric().notEmpty(),
  ]),
  contractController.createContract
);

/**-------------- Get Single Contract ---------------------------
 * @route GET /contracts/:id
 * @description Get detail a contract
 * @access Login required, Role: only Employee is owner or Manager (reportTo)
 */
router.get(
  "/:id",
  authentication.loginRequired,
  //validator param in url
  //use custom because of using self-defined function
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  validators.checkRole(["Manager", "Employee"]),
  contractController.getSingleContract
);

/**----------------- Update Contract ----------------------------
 * @route PUT /contracts/:id
 * @description Update a contract
 * @body { full name, phone, product, description, value  }
 * @access Login required, Role: only Manager is owner or Employee reportTo
 */
router.put(
  "/:id",
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  authentication.loginRequired,
  validators.checkRole(["Manager"]),

  contractController.updateContract
);

/**-------------- Delete Contract --------------------------------
 * @route DELETE /contracts/:id
 * @description Delete a contract
 * @access Login required, Role: only Manager is owner or Employee reportTo
 */
router.delete(
  "/:id",
  authentication.loginRequired,
  validators.checkRole(["Manager"]),

  contractController.deleteContract
);

/**------------------- Get All Contract -------------------------
 * @route GET /contracts?page=1&limit=10
 * @description Get all contracts with pagination
 * @access Login required
 */
router.get(
  "/",
  authentication.loginRequired,
  validators.checkRole(["Manager", "Employee"]),
  contractController.getManagerContracts
);

module.exports = router;
