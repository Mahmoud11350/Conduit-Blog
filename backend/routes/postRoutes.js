const { Router } = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  createPost,
  readPost,
  updatePost,
  deletePost,
  readAllPosts,
} = require("../controllers/postController");

const router = Router();

router.route("/").post(authMiddleware, createPost).get(readAllPosts);
router
  .route("/:id")
  .get(readPost)
  .patch(authMiddleware, updatePost)
  .delete(authMiddleware, deletePost);

module.exports = router;
