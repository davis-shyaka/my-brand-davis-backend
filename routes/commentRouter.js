const express = require("express");
const { createComment } = require("../controllers/CommentController");
const router = express.Router();

// getting all comments

// creating a comment route
router.post("/post/:id/comment", createComment);

module.exports = router;
