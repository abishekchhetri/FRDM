const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const userSchema = mongoose.Schema(
  {
    name: {
      type: "String",
      required: [true, "cannot proceed without username"],
      unique: true,
    },
    email: {
      type: "String",
      required: [true, "email is required"],
      unique: [true, "cannot procees without email"],
    },
    createdAt: {
      type: "Date",
      default: Date.now(),
    },
    photo: {
      type: "String",
      default: "default.jpg",
    },
    password: {
      type: "String",
      required: [true, "password is required"],
      min: [8, "password must be minimum 8 digits okay!"],
    },
    passwordConfirm: {
      type: "String",
      required: [true, "password confirm is required"],
      default: undefined,
      validate: [
        function (val) {
          return val === this.password;
        },
        "password dont match!",
      ],
    },
    passwordChangedAt: {
      type: "Date",
      default: undefined,
    },
    passwordReset: {
      type: "String",
      default: undefined,
    },
    passwordResetTimeout: {
      type: "Date",
      default: undefined,
    },
    role: {
      type: "String",
      default: "user",
    },
  },
  {
    toObject: { virtuals: true },
    toString: { virtuals: true },
  }
);

userSchema.virtual("comments", {
  ref: "comment",
  foreignField: "user",
  localField: "_id",
});

//password encrypting before creating password in presave mongoose web hook
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  this.passwordConfirm = undefined;
});

//create a method for checking the password
userSchema.methods.checkPassword = async function (password) {
  const isCorrect = await bcrypt.compare(password, this.password);
  return isCorrect;
};

userSchema.methods.isPasswordChanged = function (iat) {
  return new Date(this.passwordChangedAt).getTime() > iat * 1000;
};

//FORGOT PASSWORD TOKEN GENERATION
userSchema.methods.generateToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.passwordReset = crypto.createHash("sha256").update(token).digest("hex");
  this.passwordResetTimeout = Date.now() + 10 * 60 * 1000;
  return token;
};

userSchema.methods.passwordChangeDate = function () {
  this.passwordChangedAt = Date.now() - 1000;
};
const User = mongoose.model("user", userSchema);
module.exports = User;
