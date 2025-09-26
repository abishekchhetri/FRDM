const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const Email = require("../utils/email");

exports.getAllBlog = catchAsync(async (req, res, next) => {
  const blogs = await Blog.find(req.query);
  if (blogs.length < 1) next(new AppError("no blogs are there!"));
  res.status(200).json({
    status: "success",
    results: blogs.length,
    blogs,
  });
});

//for production this has the email posting for the user
exports.postBlog = catchAsync(async (req, res, next) => {
  req.body.uploadedBy = req.user.name;
  req.body.user = req.user;
  const blogs = await Blog.create(req.body);
  //this is a cool functionality but smtp in hosting platform is sluggish so it is good to check
  // if (process.env.NODE_ENV === "production")
  //   await new Email(
  //     req.user,
  //     `${req.protocol}://${req.get("host")}/blog/${blogs.slug}`
  //   ).sendUploadContent(
  //     "normalMessage",
  //     `You have just uploaded a ${blogs.type} named as ${blogs.title}, as a collaborator, if you have uploaded any thing wrong just delete otherwise you will violate our terms and policy and your account will be permanently deleted`,
  //     `uploaded a ${blogs.type}`
  //   );

  res.status(201).json({
    status: "success",
    blogs,
  });
});

//actually to resolve the bug i had to delete all comments that is associated with this blog so it wont give bug and wont overload our db
exports.deleteBlog = catchAsync(async (req, res, next) => {
  if (req.user.role === "admin") {
    const blogs = await Blog.findById(req.params.id).populate("comments");
    const a = await Promise.all(
      blogs.comments
        .map((val) => val.id)
        .map(async (val) => await Comment.findByIdAndDelete(val))
    );

    await Blog.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
      blogs,
    });
  } else {
    const blogs = await Blog.find({ user: req.user.id });
    const bool = blogs.map((val) => val.id);
    if (bool.includes(req.params.id)) {
      const blogs = await Blog.findById(req.params.id).populate("comments");

      const a = await Promise.all(
        blogs.comments
          .map((val) => val.id)
          .map(async (val) => await Comment.findByIdAndDelete(val))
      );

      await Blog.findByIdAndDelete(req.params.id);

      res.status(204).json({
        status: "success",
        blogs,
      });
    } else
      return next(new AppError("you cannot delete as a collaborator now", 500));
  }
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
  if (req.user.role === "admin") {
    const blogs = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({
      status: "success",
      blogs,
    });
  } else {
    const user = await Blog.findOne({
      $and: [{ user: req.user }, { _id: req.params.id }],
    });

    if (!user || user.length < 1)
      return next(
        new AppError(
          "You cannot update this blog because it is not your own!",
          401
        )
      );

    await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.status(204).json({
      status: "success",
      message: "you have successfully updated your content",
      // blogs,
    });
  }
});
