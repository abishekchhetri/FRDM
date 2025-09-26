const express = require("express");
const blogRouter = require("./routers/blogRoute");
const userRouter = require("./routers/userRoute");
const viewHandler = require("./routers/viewRoute");
const commentHandler = require("./routers/commentRoute");
const errorHandler = require("./controller/errorController");
const AppError = require("./utils/appError");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();
const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 300, //this is for the max limit available for a user
  message: "Too many requests are being try again in 1 hrs",
});
app.use("*", apiLimiter); //for the entire api it is the limit
// app.use(helmet()); //prevents XSS-attacks but for external images link i cant do that currently
app.use(mongoSanitize());
app.use(hpp());
app.use(express.json({ limit: "100kb" })); //limiting the body for 100kbs
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
