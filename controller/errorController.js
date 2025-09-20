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

const errorHandler = (err, req, res, next) => {
  //add mongoose apperror here and then send to err = smth
  if (process.env.NODE_ENV === "development") sendErrorDev(res, err);
  else sendErrorProd(res, err);
};
module.exports = errorHandler;
