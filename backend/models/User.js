const { Schema, model } = require("mongoose");
const { isEmail } = require("validator");
const { hash, compare } = require("bcryptjs");
const CustomError = require("../errors/customError");
const { StatusCodes } = require("http-status-codes");
const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "please provide name"],
    minlength: [3, "the minimum allowed length of the name (3)."],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "please provide  email"],
    unique: true,
    validate(value) {
      if (!isEmail(value)) {
        throw new Error("please Provide valid email address");
      }
    },
  },
  password: {
    type: String,
    required: [true, "please provide password"],
    minlength: 3,
  },
  image: {
    type: String,
    required: true,
    default:
      "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/keep-smiling-poster-design-template-a94df430a85f636340b0bea53558262c_screen.jpg?ts=1586808954",
  },
  role: {
    type: String,
    required: true,
    enum: ["user", "admin"],
  },
});
userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await hash(this.password, 8);
  }
});
userSchema.statics.findByCredintial = async function ({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError("wrong email adress", StatusCodes.BAD_REQUEST);
  }
  const isMatch = await compare(password, user.password);
  if (!isMatch) {
    throw new CustomError("wrong password", StatusCodes.BAD_REQUEST);
  }
  return user;
};

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};
const User = model("User", userSchema);
module.exports = User;
