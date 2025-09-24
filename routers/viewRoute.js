const express = require("express");
const viewHandler = require("../controller/viewController");
const authHandler = require("../controller/authController");

const router = express.Router();
router.use(authHandler.isLoggedIn);

router.route("/").get(viewHandler.getReviewOfBlog);
router.route("/blog/:slug").get(authHandler.protect, viewHandler.getBlog);
router.route("/login").get(viewHandler.login);
router.route("/signup").get(viewHandler.signup);
router.route("/forgot-password").get(viewHandler.forgotPassword);
router.route("/resetPassword/:resetToken").get(viewHandler.resetPassword);
router.route("/profile").get(authHandler.protect, viewHandler.aboutMe);
router.route("/my-comments").get(authHandler.protect, viewHandler.myComments);
router.route("/comments").get(authHandler.protect, viewHandler.comments);
router
  .route("/user")
  .get(
    authHandler.protect,
    authHandler.restrictTo("admin"),
    viewHandler.getUser
  );
router.route("/about").get(authHandler.protect, viewHandler.aboutMe);
router
  .route("/update-blog/:id")
  .get(authHandler.protect, viewHandler.updateContent);
router
  .route("/post-recipe")
  .get(authHandler.protect, viewHandler.uploadContent);

module.exports = router;
