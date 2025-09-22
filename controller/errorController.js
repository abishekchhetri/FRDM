const sendErrorDev = (req, res, err) => {
  if (req.originalUrl.includes("api"))
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  //render error in browser
  else
    res.status(err.statusCode).render("error", {
      title: "error occured",
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
};

const sendErrorProd = (req, res, err) => {
  if (req.originalUrl.includes("api")) {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      res.status(err.statusCode).json({
        status: err.status,
        message: "Something went wrong!",
      });
    }
  } else {
    if (err.isOperational) {
      res.status(err.statusCode).render("error", {
        status: err.status,
        message: err.message,
      });
    } else {
      res.status(err.statusCode).render("error", {
        status: err.status,
        message: "Something went wrong!",
      });
    }
  }
};

const errorHandler = (error, req, res, next) => {
  //add mongoose apperror here and then send to err = smth
  let err = {};
  err.status = error.status || "error";
  err.statusCode = error.statusCode || 500;
  err.message = error.message || "Something went wrong";
  err.stack = error.stack || null;

  if (process.env.NODE_ENV === "development") sendErrorDev(req, res, err);
  else sendErrorProd(req, res, err);
};
module.exports = errorHandler;
