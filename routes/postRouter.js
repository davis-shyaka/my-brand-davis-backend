const express = require("express");
const {
  allPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
  uploadCoverImage,
} = require("../controllers/PostController");
const { isAuth } = require("../middlewares/Authentication");
const {
  validatePostCreation,
  postValidation,
} = require("../middlewares/validation/PostValidation");
const router = express.Router();

// Get all posts
router.get("/allPosts", allPosts);

// Create posts
router.post("/createPost", validatePostCreation, postValidation, createPost);

// upload cover image
router.post(
  "/uploadCover",
  validatePostCreation,
  postValidation,
  uploadCoverImage
);

// Get individual post
router.get("/post/:id", getPost);

// Update posts
router.patch("/updatePost/:id", isAuth, updatePost);

// Delete posts
router.delete("/deletePost/:id", isAuth, deletePost);

module.exports = router;
