const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");

//update me crud of user done here
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const user = await User.find();
  res.status(200).json({
    status: "success",
    users: user,
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
    message: "deleted successfully " + user.name,
  });
});
