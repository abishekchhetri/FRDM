const express = require("express");
const blogRouter = require("./routers/blogRoute");
const userRouter = require("./routers/userRoute");
const viewHandler = require("./routers/viewRoute");
const commentHandler = require("./routers/commentRoute");
const errorHandler = require("./controller/errorController");
const AppError = require("./utils/appError");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", viewHandler);
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/comment", commentHandler);
app.all("*", (req, res, next) => {
  next(new AppError("cannot visit that route", 500));
});

app.use(errorHandler);
module.exports = app;
