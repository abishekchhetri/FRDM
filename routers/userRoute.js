const express = require("express");
const authHandler = require("../controller/authController");
const router = express.Router();

router.route("/signup").post(authHandler.signup);
router.route("/login").post(authHandler.login);
router.route("/forgotPassword").post(authHandler.forgotPassword);
router.route("/resetPassword/:resetToken").patch(authHandler.resetPassword);

module.exports = router;
