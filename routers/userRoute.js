const express = require("express");
const authHandler = require("../controller/authController");
const userHandler = require("../controller/userController");
const viewRoute = require("../routers/viewRoute");
const router = express.Router();

router.route("/signup").post(authHandler.signup);
router.route("/login").post(authHandler.login);
router.route("/logout").post(authHandler.logout); //use this in the logout
router.route("/forgotPassword").post(authHandler.forgotPassword);
router.route("/resetPassword/:resetToken").patch(authHandler.resetPassword);

router.use(authHandler.protect);

router.route("/me").get(userHandler.whoami);
router.route("/comments").get(userHandler.user);

router.use(authHandler.restrictTo("admin"));

router.route("/").get(userHandler.getAllUsers);
router.route("/:id").delete(userHandler.deleteUser);
module.exports = router;
