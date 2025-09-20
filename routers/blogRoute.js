const express = require("express");
const blogHandler = require("../controller/blogController");
const authHandler = require("../controller/authController");
const router = express.Router();

router.route("/").get(blogHandler.getAllBlog).post(blogHandler.postBlog);

router.use(authHandler.protect);
router
  .route("/:id")
  .get(blogHandler.findSpecificTour)
  .delete(authHandler.restrictTo("collaborator"), blogHandler.deleteBlog)
  .patch(blogHandler.updateSpecificTour);

module.exports = router;
