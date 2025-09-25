const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const AppError = require("../utils/appError");
const { promisify } = require("util");
const Email = require("../utils/email");
const crypto = require("crypto");

const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

const createSendToken = (res, user) => {
  const token = signToken(user.id);

  res.cookie("jwt", token, {
    maxAge: process.env.COOKIE_EXPIRY * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
  });

  res.status(200).json({
    status: "success",
    token,
    user,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    //for successful signup easily approach
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });
    createSendToken(res, user);
  }

  if (process.env.NODE_ENV === "production") {
    //for signup with email verification and mongoose
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    await new Email(
      user,
      `${req.protocol}://${req.get("host")}/verifyme/${user.id}`
    ).sendUploadContent(
      "normalMessage",
      "Click on the verify button to verify, so you can login again with your credentials",
      "awaiting your signup verification email message!"
    );

    res.status(200).json({
      status: "success",
      message: "signup validation email sent!",
    });
  }
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
  //***FOR BEARER TOKEN */
  // const { authorization } = req.headers;
  // if (!authorization)
  //   return next(new AppError("login to hit this route!", 401));
  // let token = authorization.split(" ")[1];

  //**FOR COOKIES */
  if (!req.cookies.jwt) return next(new AppError("login to hit this route"));
  let token;
  token = req.cookies.jwt;
  token = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  if (!token) return next(new AppError("token invalid"));
  //jwt checks if token is expired

  //checking if the user exists associated token
  const user = await User.findById(token.id);

  //checking if password was changed
  if (user?.isPasswordChanged(token.iat)) {
    res.cookie("jwt", "", { maxAge: 100 });
    return next(
      new AppError("you have changed password since you logged in!", 401)
    );
  }
  req.user = user;
  res.locals.user = req.user;
  next();
});

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  if (!req.cookies.jwt) return next();
  let token = req.cookies.jwt;
  token = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  if (!token) return next();
  //jwt checks if token is expired

  //checking if the user exists associated token
  const user = await User.findById(token.id);

  //checking if password was changed
  if (user?.isPasswordChanged(token.iat)) {
    res.cookie("jwt", "", { maxAge: 100 });
    return next();
  }
  req.user = user;
  res.locals.user = req.user;
  next();
});
//middleware function so we can let specific roles to access these roles
exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles?.includes(req.user.role))
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
    await user.save({ validateBeforeSave: false }); //saving the token to the db this way
    const resetLink = `${req.protocol}://${req.get(
      "host"
    )}/resetPassword/${token}`;

    await new Email(user, resetLink).sendMessage(
      "forgotPassword",
      "",
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
  const { password, passwordConfirm, email } = req.body;

  if (!password && !passwordConfirm && !email)
    return next(new AppError("cannot reset password fields are required!"));

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
    return next(
      new AppError("this password reset link is expired and not valid")
    );

  user.passwordReset = undefined;
  user.passwordResetTimeout = undefined;
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordChangeDate();
  await user.save();

  createSendToken(res, user);
});

//LOGOUT
exports.logout = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) res.cookie("jwt", "", { maxAge: 100 });
  res.status(200).json({
    status: "success",
    message: "successfully logged out!",
  });
});
