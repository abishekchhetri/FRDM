const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  comment: {
    type: "String",
    required: [true, "A comment is required"],
  },
  createdAt: {
    type: "Date",
    default: Date.now(),
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
  },
  blog: {
    type: mongoose.Schema.ObjectId,
    ref: "blog",
  },
});

commentSchema.pre(/^find/, function (next) {
  this.find()
    .populate({
      path: "user",
      select: "-password",
    })
    .populate({
      path: "blog",
    });
  next();
});

const Comment = mongoose.model("comment", commentSchema);
module.exports = Comment;
