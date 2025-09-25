const express = require("express");
const viewHandler = require("../controller/viewController");
const authHandler = require("../controller/authController");

const router = express.Router();
router.use(authHandler.isLoggedIn);

router.route("/").get(viewHandler.getReviewOfBlog);
router.route("/blog/:slug").get(viewHandler.getBlog);
router.route("/login").get(viewHandler.login);
router.route("/signup").get(viewHandler.signup);
router.route("/forgot-password").get(viewHandler.forgotPassword);
router.route("/resetPassword/:resetToken").get(viewHandler.resetPassword);

router.route("/profile").get(authHandler.protect, viewHandler.aboutMe);
router.route("/my-comments").get(authHandler.protect, viewHandler.myComments);
// comments route is for updating the user
router
  .route("/user-management")
  .get(
    authHandler.protect,
    authHandler.restrictTo("admin"),
    viewHandler.comments
  );
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
  .get(
    authHandler.protect,
    authHandler.restrictTo("admin", "collaborator"),
    viewHandler.updateContent
  );
router
  .route("/post-recipe")
  .get(
    authHandler.protect,
    authHandler.restrictTo("admin", "collaborator"),
    viewHandler.uploadContent
  );

router
  .route("/warn/:id")
  .get(
    authHandler.protect,
    authHandler.restrictTo("admin"),
    viewHandler.warnViolation
  );
router
  .route("/promote/:id")
  .get(
    authHandler.protect,
    authHandler.restrictTo("admin"),
    viewHandler.promotion
  );
router.route("/verifyMe/:id").get(authHandler.protect, viewHandler.verifyMe);

router.route("/blogs").get(viewHandler.showAllBlogs);
router.route("/recipes").get(viewHandler.showAllRecipes);
module.exports = router;
