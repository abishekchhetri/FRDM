const express = require("express");
const blogRouter = require("./routers/blogRoute");
const userRouter = require("./routers/userRoute");
const errorHandler = require("./controller/errorController");
const AppError = require("./utils/appError");
const app = express();

app.use(express.json());

app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/user", userRouter);
app.all("*", (req, res, next) => {
  next(new AppError("cannot visit that route", 500));
});

app.use(errorHandler);
module.exports = app;
