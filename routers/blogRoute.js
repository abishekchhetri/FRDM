const express = require("express");
const blogHandler = require("../controller/blogController");
const router = express.Router();

router.route("/").get(blogHandler.getAllBlog).post(blogHandler.postBlog);

router
  .route("/:id")
  .get(blogHandler.findSpecificTour)
  .delete(blogHandler.deleteBlog)
  .patch(blogHandler.updateSpecificTour);

module.exports = router;
