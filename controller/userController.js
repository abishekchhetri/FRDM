const User = require("../models/user");
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const catchAsync = require("../utils/catchAsync");

//update me crud of user done here
exports.getAllUsers = catchAsync(async (req, res, next) => {
  //we inject req.query in our app so we can find user by email or by the name
  const user = await User.find(req.query).populate({
    path: "comments",
    select: "",
  });

  res.status(200).json({
    status: "success",
    users: user,
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const promises = [
    await User.findByIdAndDelete(req.params.id),
    await Comment.deleteMany({ user: req.params.id }),
    await Blog.deleteMany({ user: req.params.id }),
  ];

  await Promise.all(promises);

  res.status(204).json({
    status: "success",
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
