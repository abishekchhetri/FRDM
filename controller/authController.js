const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const AppError = require("../utils/appError");
const { promisify } = require("util");
//signup, login, protect, restrict, forgot/reset password and all such feature

const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

const createSendToken = (res, user) => {
  const token = signToken(user.id);
  res.status(200).json({
    status: "success",
    token,
    user,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  createSendToken(res, user);
});

exports.login = catchAsync(async (req, res, next) => {
  //check if the field exists
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("cannot login with these credentials!", 401));
  const user = await User.find({ email });

  //check if the user exists
  if (!user || user.length < 1) return next(new AppError("user not available"));

  //now check password then finally send token

  if (await user[0].checkPassword(password)) createSendToken(res, user[0]);
  else return next(new AppError("either email or password is incorrect"));
});

exports.protect = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization)
    return next(new AppError("login to hit this route!", 401));
  let token = authorization.split(" ")[1];
  token = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  if (!token) return next(new AppError("token invalid"));
  //jwt checks if token is expired

  //checking if the user exists associated token
  const user = await User.findById(token.id);

  //checking if password was changed
  if (!user.isPasswordChanged()) console.log("okay!!");
  else
    return next(
      new AppError("you have changed password since you logged in!", 401)
    );
  req.user = user;
  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new AppError("user restricted to access this route"));
    next();
  };
