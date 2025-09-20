const sendErrorDev = (res, err) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (res, err) => {
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
};

const errorHandler = (error, req, res, next) => {
  //add mongoose apperror here and then send to err = smth
  let err = {};
  err.status = error.status || "error";
  err.statusCode = error.statusCode || 500;
  err.message = error.message || "Something went wrong";
  err.stack = error.stack || null;

  if (process.env.NODE_ENV === "development") sendErrorDev(res, err);
  else sendErrorProd(res, err);
};
module.exports = errorHandler;
