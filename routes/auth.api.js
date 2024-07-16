const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { body } = require("express-validator");
const validators = require("../middlewares/validators");

/**-----------------------------------------------------
 * @route POST /auth/login
 * @description Log in with username and password
 * @body {username,password}
 * @access Public
 */
router.post(
  "/login",
  validators.validate([
    body("username", "Invalid name").exists().notEmpty(),
    body("password", "Invalid password").exists().notEmpty(),
  ]),
  authController.loginWithUsername
);

module.exports = router;
