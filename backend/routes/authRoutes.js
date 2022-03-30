const { Router } = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  newUser,
  loginUser,
  logoutUser,
} = require("../controllers/authController");

const router = Router();

router.route("/").post(newUser).get(authMiddleware, logoutUser);
router.route("/login").post(loginUser);

module.exports = router;
