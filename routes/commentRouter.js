const express = require("express");
const {
  createComment,
  allComments,
  deleteComment,
} = require("../controllers/CommentController");
const router = express.Router();

// getting all comments
router.get("/allComments", allComments);

// creating a comment route
router.post("/post/:id/comment", createComment);

// deleting a comment
router.delete("/comments/:postId/:commentId", deleteComment);

module.exports = router;
