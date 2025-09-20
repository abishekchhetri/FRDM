const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Blog = require("../models/blog");

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
  const blogs = await Blog.create(req.body);
  res.status(201).json({
    status: "success",
    blogs,
  });
});

exports.deleteBlog = catchAsync(async (req, res, next) => {
  const blogs = await Blog.findByIdAndDelete(req.params.id);
  res.status(204).json({});
});

exports.findSpecificTour = catchAsync(async (req, res, next) => {
  const blogs = await Blog.findById(req.params.id);
  res.status(200).json({
    status: "success",
    blogs,
  });
});

exports.updateSpecificTour = catchAsync(async (req, res, next) => {
  const blogs = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json({
    status: "success",
    blogs,
  });
});
