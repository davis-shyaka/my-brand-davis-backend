const express = require("express");
const {
  allPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
} = require("../controllers/PostController");
const {
  validatePostCreation,
  postValidation,
} = require("../middlewares/validation/PostValidation");
const router = express.Router();

// Get all posts
router.get("/allPosts", allPosts);

// Create posts
router.post("/createPost", validatePostCreation, postValidation, createPost);

// Get individual post
router.get("/post/:id", getPost);

// Update posts
router.patch("/updatePost/:id", updatePost);

// Delete posts
router.delete("/deletePost/:id", deletePost);

module.exports = router;
