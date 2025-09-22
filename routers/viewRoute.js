const express = require("express");
const viewHandler = require("../controller/viewController");
const router = express.Router();
const authHandler = require("../controller/authController");

router.use(authHandler.isLoggedIn);

router.route("/").get(viewHandler.getReviewOfBlog);
router.route("/blog/:slug").get(authHandler.protect, viewHandler.getBlog);
router.route("/login").get(viewHandler.login);
router.route("/signup").get(viewHandler.signup);
router.route("/forgot-password").get(viewHandler.forgotPassword);
router.route("/resetPassword/:resetToken").get(viewHandler.resetPassword);
router.route("/profile").get(authHandler.protect, viewHandler.me);
router.route("/my-comments").get(authHandler.protect, viewHandler.myComments);
router.route("/comments").get(authHandler.protect, viewHandler.comments);
module.exports = router;
