const express = require("express");
const blogHandler = require("../controller/blogController");
const authHandler = require("../controller/authController");
const router = express.Router();

router
  .route("/")
  .get(blogHandler.getAllBlog)
  .post(
    authHandler.protect,
    authHandler.restrictTo("admin", "collaborator"),
    blogHandler.postBlog
  );

router.use(authHandler.protect);
router
  .route("/:id")
  .get(blogHandler.findSpecificBlog)
  .delete(authHandler.restrictTo("admin"), blogHandler.deleteBlog)
  .patch(authHandler.restrictTo("admin"), blogHandler.updateSpecificBlog);

module.exports = router;
