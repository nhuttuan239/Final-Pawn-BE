const express = require("express");
const router = express.Router();
const interestController = require("../controllers/interest.controller");
const { body, param } = require("express-validator");
const validators = require("../middlewares/validators");
const authentication = require("../middlewares/authentication");

/**------------------ Create New Interest ------------------
 * @route POST /interest
 * @description Create a new interest rate
 * @body {interestType, date min, date max, interest rate }
 * @access Login required, role: only Manager
 */
router.post(
  "/",
  authentication.loginRequired,
  validators.validate([
    body("interestType").exists().notEmpty(),
    body("dateStart").notEmpty(),
    body("dateEnd").notEmpty(),
    body("description").notEmpty(),
    body("interest").notEmpty(),
  ]),

  validators.checkRole(["Manager"]),
  interestController.createNewInterest
);

/**----------------- Update Interest ------------------------
 * @route PUT /interest/:id
 * @description Update a interest rate
 * @body { product type, date min, date max, interest rate  }
 * @access Login required, role: only Manager
 */
router.put(
  "/:id",
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  authentication.loginRequired,
  validators.checkRole(["Manager"]),

  interestController.updateInterest
);

/**-------------- Delete Interest ---------------------------
 * @route DELETE /interest/:id
 * @description Delete a interest rate
 * @access Login required, role: only Manager
 */
router.delete(
  "/:id",
  authentication.loginRequired,
  validators.checkRole(["Manager"]),

  interestController.deleteInterest
);

/**------------------- Get All Interest ----------------------
 * @route GET /interest?page=1&limit=10
 * @description Get all interest rate with pagination
 * @access Login required, role: only Manager
 */
router.get(
  "/",
  authentication.loginRequired,
  validators.checkRole(["Manager"]),
  interestController.getInterest
);

module.exports = router;
