const catchAsync = require("../utils/catchAsync");
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
