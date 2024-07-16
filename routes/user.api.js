const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { body, param } = require("express-validator");
const validators = require("../middlewares/validators");
const authentication = require("../middlewares/authentication");

/**------------------ Get Current User --------------------------
 * @route GET /users/me
 * @description Get current account info
 * @access Login required
 */
router.get("/me", authentication.loginRequired, userController.getCurrentUser);

/**------------------- Update Current User --------------------
 * @route PUT /users/me
 * @description Update current user profile
 * @body {username, password, description, contact}
 * @access Login required
 */
router.put(
  "/me",
  authentication.loginRequired,
  userController.updateCurrentUser
);

/**------------------- Get All user ----------------------
 * @route GET /users?page=1&limit=10
 * @description Get all users with pagination
 * @access Login required, role: only Admin
 */
router.get(
  "/",
  authentication.loginRequired,
  validators.checkRole(["Admin", "Manager"]),
  userController.getUsers
);

/**------------------ Create New User ------------------
 * @route POST /users
 * @description Create a new user
 * @body {username, password, description, address}
 * @access Login required, role: role: only Admin
 */
router.post(
  "/",
  validators.validate([
    body("username", "Invalid Name").exists().notEmpty(),
    body("email", "Invalid Email")
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false }),
    body("password", "Invalid Password").notEmpty(),
    body("reportTo").isString(),
  ]),
  authentication.loginRequired,
  validators.checkRole(["Admin"]),
  userController.createUser
);

/**----------------- Update User ------------------------
 * @route PUT /users/:id
 * @description Update user profile
 * @body {username, password, description, contact}
 * @access Login required, role: only Admin
 */
router.put(
  "/:id",
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  authentication.loginRequired,
  validators.checkRole(["Admin"]),

  userController.updateUser
);

/**-------------- Delete User ---------------------------
 * @route DELETE /users/:id
 * @description Delete a user
 * @access Login required, role: Admin
 */
router.delete(
  "/:id",
  authentication.loginRequired,
  validators.checkRole(["Admin"]),

  userController.deleteUser
);

module.exports = router;
