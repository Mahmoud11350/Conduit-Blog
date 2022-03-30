const { Router } = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  createComment,
  readComment,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");

const router = Router();

router.route("/").post(authMiddleware, createComment);
router
  .route("/:id")
  .patch(authMiddleware, updateComment)
  .get(readComment)
  .delete(authMiddleware, deleteComment);

module.exports = router;
