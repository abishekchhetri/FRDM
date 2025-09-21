const mongoose = require("mongoose");
const slugify = require("slugify");
const blogSchema = mongoose.Schema(
  {
    title: {
      type: "String",
      maxLength: [30, "max length of a blog is exceeded!"],
      required: [true, "blog has a name"],
    },
    photo: {
      type: "String",
      default: undefined,
    },
    createdAt: {
      type: "Date",
      default: Date.now(),
    },
    description: {
      type: "String",
      required: [true, "blog must have description"],
    },
    uploadedBy: {
      type: "String",
      default: "admin",
    },
    slug: {
      type: "String",
    },
    //we populate the comments here by virtual populate
  },
  {
    toString: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

blogSchema.virtual("comments", {
  ref: "comment",
  foreignField: "blog",
  localField: "_id",
});

blogSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});
const Blog = mongoose.model("blog", blogSchema);
module.exports = Blog;
