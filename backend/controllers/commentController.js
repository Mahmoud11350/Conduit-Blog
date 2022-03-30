const { StatusCodes } = require("http-status-codes");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const CustomError = require("../errors/customError");
const { checkPermision } = require("../middlewares/authMiddleware");
// create Comment
const createComment = async (req, res) => {
  const post = await Post.findOne({ _id: req.body.post });
  if (!post) {
    throw new CustomError("can't find the post", StatusCodes.BAD_REQUEST);
  }
  const comment = await Comment.create({ ...req.body, user: req.user.userId });
  res.status(StatusCodes.CREATED).json({ comment });
};

// Read Comment

const readComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    throw new CustomError(
      `can't find comment with id ${req.params.id}`,
      StatusCodes.NOT_FOUND
    );
  }
  res.status(StatusCodes.OK).json({ comment });
};

// Update Comment
const updateComment = async (req, res) => {
  const oldComment = await Comment.findById(req.params.id);

  if (!oldComment) {
    throw new CustomError(
      `can't find comment with id ${req.params.id}`,
      StatusCodes.NOT_FOUND
    );
  }
  const signedUser = req.user.userId;
  const userPost = oldComment.user;
  checkPermision({ signedUser, userPost });
  const validUpdate = ["comment", "like"];
  const wantUpdate = Object.keys(req.body);
  const isValidUpdate = wantUpdate.every((update) =>
    validUpdate.includes(update)
  );

  if (!isValidUpdate) {
    throw new CustomError("not valid update ", StatusCodes.BAD_REQUEST);
  }

  const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(StatusCodes.OK).json({ comment });
};

// delete Comment

const deleteComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    throw new CustomError(
      `can't find comment with id ${req.params.id}`,
      StatusCodes.NOT_FOUND
    );
  }
  const signedUser = req.user.userId;
  const userPost = comment.user;
  checkPermision({ signedUser, userPost });

  await comment.remove();

  res.status(StatusCodes.OK).json({ msg: "comment deleted successfully" });
};

module.exports = {
  createComment,
  readComment,
  updateComment,
  deleteComment,
};
