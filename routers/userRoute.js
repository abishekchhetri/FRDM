const express = require("express");
const authHandler = require("../controller/authController");
const userHandler = require("../controller/userController");
const router = express.Router();

router.route("/signup").post(authHandler.signup);
router.route("/login").post(authHandler.login);
router.route("/forgotPassword").post(authHandler.forgotPassword);
router.route("/resetPassword/:resetToken").patch(authHandler.resetPassword);

router.use(authHandler.protect);
router.route("/").get(userHandler.getAllUsers);
router.route("/:id").get(userHandler.deleteUser);
module.exports = router;
