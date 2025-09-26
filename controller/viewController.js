const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const Blog = require("../models/blog");
const AppError = require("../utils/appError");
const Email = require("../utils/email");

exports.getReviewOfBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.find(req.query).sort("-createdAt");
  if (blog.length < 1) return next(new AppError("No results found!", 500));
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
    flag: true,
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

  if (userS) {
    if (userS.id === req.user.id)
      res.redirect(`${req.protocol}://${req.get("host")}/profile`);
    else
      res.status(200).render("userDashboard", {
        title: !userS ? "No users Found" : userS.name,
        userS,
        blogs: userS.blogs,
        flag: true,
      });
  } else return next(new AppError("No user available!", 500));
});

exports.aboutMe = catchAsync(async (req, res, next) => {
  const userS = await User.findById(req.user.id)
    .populate({
      path: "comments",
      select: "",
    })
    .populate("blogs");

  res.status(200).render("userDashboard", {
    title: !userS ? "No users Found" : userS.name,
    userS,
    blogs: userS.blogs,
  });
});

exports.uploadContent = catchAsync(async (req, res, next) => {
  res.status(200).render("uploadRecipeBlog", {
    title: "upload data",
  });
});

exports.updateContent = catchAsync(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  res.status(200).render("uploadRecipeBlog", {
    title: "update blog",
    blog,
    update: true,
  });
});

exports.verifyMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, {
    verified: "yes",
  }).setOptions({
    disablePreFind: true,
  });

  if (user) res.redirect(`${req.protocol}://${req.get("host")}/login`);
  else
    res.status(401).json({
      status: "fail",
      message:
        "this user is already verified or deleted due to verification time exceeding!",
    });
});

exports.warnViolation = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  await new Email(
    user,
    `${req.protocol}://${req.get("host")}/`
  ).sendUploadContent(
    "normalMessage",
    `Hello, you have recieved this email because you have violated rules of this site, reasons for violation: you either have uploaded inappropriate content or any comments, this is the last warning and if dont take any action on that, you will be deleted including all your blogs comments will be deleted so coorporate to make this site useful and safe for all users','Content violation`
  );
  res.status(200).redirect(`${req.protocol}://${req.get("host")}/`);
});

exports.promotion = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.params.id, {
    role: "collaborator",
    photo: "collaborator.png",
  });
  res.status(200).redirect(`${req.protocol}://${req.get("host")}/`);
});

exports.showAllRecipes = catchAsync(async (req, res, next) => {
  const blog = await Blog.find({ type: "recipe" }).sort("-createdAt");
  res.status(200).render("frontpageLanding", {
    title: "overview",
    blogs: blog,
  });
});

exports.showAllBlogs = catchAsync(async (req, res, next) => {
  const blog = await Blog.find({ type: "blog" }).sort("-createdAt");
  res.status(200).render("frontpageLanding", {
    title: "overview",
    blogs: blog,
  });
});

exports.about = catchAsync(async (req, res, next) => {
  res.status(200).render("about", {
    title: "about",
  });
});
