const express = require("express");
const {
  allPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
  uploadCoverImage,
} = require("../controllers/PostController");
const { isAuth, isAdmin } = require("../middlewares/Authentication");
const {
  validatePostCreation,
  postValidation,
} = require("../middlewares/validation/PostValidation");
const router = express.Router();

// Get all posts
router.get("/post/all", allPosts);

// Create posts
router.post(
  "/post/create",
  isAuth,
  isAdmin,
  validatePostCreation,
  postValidation,
  createPost
);

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
router.patch("/post/update/:id", isAuth, updatePost);

// Delete posts
router.delete("/posts/delete/:id", isAuth, deletePost);

module.exports = router;
