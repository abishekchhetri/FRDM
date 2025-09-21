const express = require("express");
const viewHandler = require("../controller/viewController");
const router = express.Router();
const authHandler = require("../controller/authController");

router.use(authHandler.isLoggedIn);

router.route("/all").get(viewHandler.getReviewOfBlog);
router.route("/blog/:slug").get(viewHandler.getBlog);
router.route("/login").get(viewHandler.login);
router.route("/signup").get(viewHandler.signup);
module.exports = router;
