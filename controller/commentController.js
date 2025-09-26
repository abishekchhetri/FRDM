const Comment = require("../models/comment");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.showAllComments = catchAsync(async (req, res, next) => {
  const comments = await Comment.find();
  if (!comments || comments.length < 1)
    return next(new AppError("cannot load comments it is empty", 500));
  res.status(200).json({
    status: "success",
    comments,
  });
});

exports.postComment = catchAsync(async (req, res, next) => {
  const { blogId } = req.params;
  const userId = req.user.id;
  if (!userId && !blogId)
    return next(
      new AppError(
        "cannot post comment userid, blogid or comment missing!",
        401
      )
    );
  const commentData = await Comment.create({
    comment: req.body.comment,
    blog: blogId,
    user: userId,
  });

  res.status(201).json({
    status: "success",
    commentData,
  });
});

exports.showOneComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  res.status(200).json({
    status: "success",
    comment,
  });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  if (req.user.role === "admin") {
    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "success",
      message: "comment was deleted!",
    });
  } else {
    const comments = await Comment.findOne({
      $and: [{ user: req.user.id }, { _id: req.params.id }],
    });

    if (!comments || comments.length < 1)
      return next(new AppError("you can delete only your comment!", 401));

    await Comment.findByIdAndDelete(comments.id);

    res.status(200).json({
      status: "success",
      message: "you are not an admin so you cannot delete",
    });
  }
});

//delete comment of specific user
exports.deleteCommentOfUser = catchAsync(async (req, res, next) => {
  const { comment } = req.params;
  if (!comment) return next(new AppError("specify comment id"));

  if (req.comments.includes(comment))
    res.status(200).json({
      status: "success",
      comments: req.comments,
    });
  else return next(new AppError("Cannot delete that comment!"));
});
