const catchAsync = require("../utils/catchAsync");
const Blog = require("../models/blog");

exports.getReviewOfBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.find();
  console.log(req.user);

  res.status(200).render("frontpageLanding", {
    title: "overview",
    blogs: blog,
    user: req.user,
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
