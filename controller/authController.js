const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const AppError = require("../utils/appError");
const { promisify } = require("util");
const Email = require("../utils/email");
const crypto = require("crypto");
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

//middleware function so we can let specific roles to access these roles
exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new AppError("user restricted to access this route"));
    next();
  };

//now reset and forgot password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new AppError("email field is empty!"));
  const [user] = await User.find({ email });
  if (!user)
    return next(new AppError("cannot find user associated with this email"));

  try {
    const token = user.generateToken();
    user.save({ validateBeforeSave: false }); //saving the token to the db this way
    const resetLink = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/user/resetPassword/${token}`;

    await new Email(user, resetLink).sendMessage(
      "This is password reset link if you have not initiated password reset please ignore this email here is the password reset token " +
        resetLink,
      "password reset link"
    );
    res.status(200).json({
      status: "success",
      message: "password reset was just sent to user!",
    });
  } catch (err) {
    user.passwordReset = undefined;
    user.passwordResetTimeout = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError("cannot generate password reset link!"));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { resetToken } = req.params;
  if (!resetToken)
    return next(new AppError("cannot reset password invalid token"));
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const [user] = await User.find({
    passwordReset: hashedToken,
    passwordResetTimeout: { $gte: Date.now() },
  });

  if (!user)
    return next(new AppError("password reset is expired or not valid"));

  user.passwordReset = undefined;
  user.passwordResetTimeout = undefined;
  await user.save({ validateBeforeSave: false });

  createSendToken(res, user);
});
