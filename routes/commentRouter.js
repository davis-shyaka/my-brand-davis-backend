const express = require("express");
const {
  createComment,
  allComments,
} = require("../controllers/CommentController");
const router = express.Router();

// getting all comments
router.get("/allComments", allComments);

// creating a comment route
router.post("/post/:id/comment", createComment);

module.exports = router;
