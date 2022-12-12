const express = require("express");
const {
  createComment,
  allComments,
  deleteComment,
} = require("../controllers/CommentController");
const { isAuth } = require("../middlewares/Authentication");
const router = express.Router();

// getting all comments
router.get("/comment/all", allComments);

// creating a comment
router.post("/post/comment/create/:id", isAuth, createComment);

// deleting a comment
router.delete("/comment/delete/:id", isAuth, deleteComment);

module.exports = router;
