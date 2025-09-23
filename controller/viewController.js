const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const Blog = require("../models/blog");

exports.getReviewOfBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.find();
  res.status(200).render("frontpageLanding", {
    title: "overview",
    blogs: blog,
  });
});

exports.getBlog = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const blog = await Blog.findOne({ slug }).populate("comments");
  res.status(200).render("renderBlog", {
    title: slug,
    blog,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  res.render("login", {
    title: "login",
  });
});

exports.signup = catchAsync(async (req, res, next) => {
  res.render("login", {
    title: "login",
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  res.render("forgotPassword", {
    title: "forgot-password",
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  res.render("resetPassword", {
    title: "reset-password",
  });
});

exports.me = catchAsync(async (req, res, next) => {
  res.render("landme", {
    title: "me",
  });
});

exports.myComments = catchAsync(async (req, res, next) => {
  const comments = await User.findById(req.user.id).populate({
    path: "comments",
    select: "",
    options: { sort: { createdAt: -1 } },
  });

  res.render("comments", {
    title: "my comments",
    comments: comments.comments,
  });
});

exports.comments = catchAsync(async (req, res, next) => {
  res.render("userComments", {
    title: "Admin: comments",
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const userS = await User.findOne(req.query)
    .populate({
      path: "comments",
      select: "",
    })
    .populate("blogs");

  console.log(userS.blogs);

  res.status(200).render("userDashboard", {
    title: !userS ? "No users Found" : userS.name,
    userS,
    flag: true,
  });
});

exports.aboutMe = catchAsync(async (req, res, next) => {
  const userS = req.user;
  res.status(200).render("userDashboard", {
    title: !userS ? "No users Found" : userS.name,
    userS,
  });
});
