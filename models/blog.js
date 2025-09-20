const mongoose = require("mongoose");

const blogSchema = mongoose.Schema(
  {
    title: {
      type: "String",
      maxLength: [20, "max length of a blog is exceeded!"],
      required: [true, "blog has a name"],
    },
    photo: {
      type: "String",
      required: [true, "blog must have a photo (url)"],
    },
    createdAt: {
      type: "Date",
      default: Date.now(),
    },
    description: {
      type: "String",
      required: [true, "blog must have description"],
    },
    //we populate the comments here by virtual populate
  },
  {
    toString: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

const Blog = mongoose.model("blog", blogSchema);
module.exports = Blog;
