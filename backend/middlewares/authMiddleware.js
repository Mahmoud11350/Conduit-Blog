const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/customError");
const { verify } = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    throw new CustomError("un authinticated", StatusCodes.UNAUTHORIZED);
  }

  try {
    const user = verify(token, process.env.SECRET_TOKEN);
    req.user = user;
  } catch (error) {
    throw new CustomError("un authinticated", StatusCodes.UNAUTHORIZED);
  }

  next();
};

const checkPermision = ({ signedUser, userPost }) => {
  if (signedUser !== userPost.toString()) {
    throw new CustomError(
      "don't have permission to change this",
      StatusCodes.BAD_REQUEST
    );
  }
};

module.exports = { authMiddleware, checkPermision };
