const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/customError");
const { checkPermision } = require("../middlewares/authMiddleware");
const Post = require("../models/Post");

// Create New Post
const createPost = async (req, res) => {
  const post = await Post.create({
    ...req.body,
    user: req.user.userId,
  });
  res.status(StatusCodes.CREATED).json({ post });
};

// Read Post

const readPost = async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id }).populate("comments");
  if (!post) {
    throw new CustomError("can't find post ", StatusCodes.NOT_FOUND);
  }
  res.status(StatusCodes.OK).json({ post });
};

// Read All Posts

const readAllPosts = async (req, res) => {
  const posts = await Post.find({});
  res.status(StatusCodes.OK).json({ posts });
};

// Update post

const updatePost = async (req, res) => {
  const oldPost = await Post.findById(req.params.id);
  if (!oldPost) {
    throw new CustomError(
      `cant find post with id ${req.params.id}`,
      StatusCodes.NOT_FOUND
    );
  }
  const signedUser = req.user.userId;
  const userPost = oldPost.user;
  checkPermision({ signedUser, userPost });
  const validUpdate = ["title", "content", "tags"];
  const wantUpdate = Object.keys(req.body);
  const isValidUpdate = wantUpdate.every((update) =>
    validUpdate.includes(update)
  );
  if (!isValidUpdate) {
    throw new CustomError("update not valid", StatusCodes.BAD_REQUEST);
  }
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.OK).json({ post });
};

// Delete Post

const deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    throw new CustomError(
      `cant find post with id ${req.params.id}`,
      StatusCodes.NOT_FOUND
    );
  }
  const signedUser = req.user.userId;
  const userPost = post.user;
  checkPermision({ signedUser, userPost });
  await post.remove();
  res.status(StatusCodes.OK).json({ msg: "delete post Succeed" });
};

module.exports = {
  createPost,
  readPost,
  updatePost,
  deletePost,
  readAllPosts,
};
