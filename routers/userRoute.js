const express = require("express");
const authHandler = require("../controller/authController");
const router = express.Router();

router.route("/signup").post(authHandler.signup);
router.route("/login").post(authHandler.login);

module.exports = router;
