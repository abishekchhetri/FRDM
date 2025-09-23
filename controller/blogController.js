const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Blog = require("../models/blog");
const Comment = require("../models/comment");

exports.getAllBlog = catchAsync(async (req, res, next) => {
  const blogs = await Blog.find();
  if (blogs.length < 1) next(new AppError("no blogs are there!"));
  res.status(200).json({
    status: "success",
    results: blogs.length,
    blogs,
  });
});

exports.postBlog = catchAsync(async (req, res, next) => {
  req.body.user = req.user.id;
  const blogs = await Blog.create(req.body);
  res.status(201).json({
    status: "success",
    blogs,
  });
});

//actually to resolve the bug i had to delete all comments that is associated with this blog so it wont give bug and wont overload our db
exports.deleteBlog = catchAsync(async (req, res, next) => {
  const blogs = await Blog.findById(req.params.id).populate("comments");

  const a = await Promise.all(
    blogs.comments
      .map((val) => val.id)
      .map(async (val) => await Comment.findByIdAndDelete(val))
  );
  console.log(a);

  await Blog.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
    blogs,
  });
});

exports.findSpecificBlog = catchAsync(async (req, res, next) => {
  const blogs = await Blog.findById(req.params.id)
    .populate("comments")
    .populate("user");
  res.status(200).json({
    status: "success",
    blogs,
  });
});

exports.updateSpecificBlog = catchAsync(async (req, res, next) => {
  const blogs = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json({
    status: "success",
    blogs,
  });
});
