const express = require("express");
const {
  createComment,
  allComments,
  deleteComment,
} = require("../controllers/CommentController");
const { isAuth } = require("../middlewares/Authentication");
const router = express.Router();

// getting all comments
router.get("/allComments", allComments);

// creating a comment route
router.post("/post/:id/comment", isAuth, createComment);

// deleting a comment
router.delete("/deleteComment/:id", isAuth, deleteComment);

module.exports = router;
