const { StatusCodes } = require("http-status-codes");
const errorHandler = (err, req, res, next) => {
  let customError = {
    customMsg: err.message || "something went wrong , please try again later",
    statusCode: err.statusCode || 500,
  };

  if (err && err.name === "ValidationError") {
    const errorsKeys = Object.keys(err.errors);
    customError.customMsg = errorsKeys
      .map((error) => {
        return err.errors[error].message;
      })
      .join(" & ");

    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  if (err && err.code === 11000) {
    customError.customMsg = "email already exist";
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  if (err && err.name === "CastError") {
    customError.customMsg = "please provid correct post id";
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  // return res.send(err);
  return res
    .status(customError.statusCode)
    .json({ msg: customError.customMsg });
};

module.exports = errorHandler;
