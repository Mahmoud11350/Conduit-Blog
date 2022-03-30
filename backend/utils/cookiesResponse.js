require("dotenv").config();
const { sign } = require("jsonwebtoken");
const cookiesResponse = ({ userToken, res }) => {
  const token = sign(userToken, process.env.SECRET_TOKEN);
  const oneDay = 60 * 60 * 24 * 1000;
  res.cookie("token", token, {
    httpOnly: true,
    signed: true,
    secure: false,
    expires: new Date(Date.now() + oneDay),
  });
  return token;
};

module.exports = {
  cookiesResponse,
};
