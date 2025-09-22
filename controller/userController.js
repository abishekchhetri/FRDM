const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");

//update me crud of user done here
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const user = await User.find();
  res.status(200).json({
    status: "success",
    users: user,
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
    message: "deleted successfully " + user.name,
  });
});

//COMMENTS OF A SPECIFIC USER
exports.user = catchAsync(async (req, res, next) => {
  const comments = await User.findById(req.user.id).populate({
    path: "comments",
    select: "",
    options: { sort: { createdAt: -1 } },
  });

  res.status(200).json({
    status: "success",
    results: comments.comments.length,
    comment: comments.comments,
  });
});

//DELETE COMMENT OF A SPECIFIC USER BY USER THEMSELF
exports.passCommentsOfUser = catchAsync(async (req, res, next) => {
  const comments = await User.findById(req.user.id).populate({
    path: "comments",
  });
  req.comments = comments.comments.map((val) => val.id);
  next();
});

exports.whoami = catchAsync(async (req, res, next) => {
  if (req.user)
    res.status(200).json({
      status: "success",
      user: req.user,
    });
});
