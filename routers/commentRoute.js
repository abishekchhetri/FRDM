const commentHandler = require("../controller/commentController");
const authHandler = require("../controller/authController");
const userHandler = require("../controller/userController");
const express = require("express");
const router = express.Router();

router.use(authHandler.protect);
router
  .route("/")
  .get(authHandler.restrictTo("admin"), commentHandler.showAllComments);

router
  .route("/delete-user-comment/:comment")
  .delete(userHandler.passCommentsOfUser, commentHandler.deleteCommentOfUser);

router.route("/:blogId/:userId").post(commentHandler.postComment);

router.use(authHandler.restrictTo("admin"));
router
  .route("/:id")
  .get(commentHandler.showOneComment)
  .delete(commentHandler.deleteComment);

module.exports = router;
