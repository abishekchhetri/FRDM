const mongoose = require("mongoose");
const slugify = require("slugify");
const blogSchema = mongoose.Schema(
  {
    title: {
      type: "String",
      maxLength: [200, "max length of a blog is exceeded!"],
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

    //type specifies the blog or recipe
    type: {
      type: "String",
      enum: ["recipe", "blog"],
      required: [
        true,
        "you cannot post without specifying if it is a blog or recipe",
      ],
    },
    // *******Recipe in db optional triggered by type***********
    howToCook: {
      type: "String",
    },
    ingredients: {
      type: "String",
    },
    time: {
      type: "String",
    },
    calories: {
      type: "String",
    },
    //************************** */
    slug: {
      type: "String",
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
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
