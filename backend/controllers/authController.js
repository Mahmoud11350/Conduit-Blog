const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const { cookiesResponse } = require("../utils/cookiesResponse");

const newUser = async (req, res) => {
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";
  const user = await User.create({
    ...req.body,
    role,
  });
  const userToken = {
    userId: user._id,
    name: user.name,
    role: user.role,
  };
  cookiesResponse({ userToken, res });
  res.status(StatusCodes.CREATED).json({ user });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findByCredintial({ email, password });
  const userToken = {
    userId: user._id,
    name: user.name,
    role: user.role,
  };
  cookiesResponse({ userToken, res });
  res.status(StatusCodes.OK).json({ user });
};

const logoutUser = async (req, res) => {
  const token = req.token;
  res.cookie("token", token, {
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out successfully" });
};

module.exports = {
  newUser,
  loginUser,
  logoutUser,
};
