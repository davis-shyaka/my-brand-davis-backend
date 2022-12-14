const Post = require("../models/PostModel");
const cloudinary = require("../helper/imageUpload");

// Get all posts
exports.allPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get individual post
exports.getPost = async (req, res) => {
  try {
    let post = await Post.findOne({ _id: req.params.id });
    if (!post) {
      res.status(404).send({ success: false, message: "Post doesn't exist!" });
    } else res.status(200).json(post);
  } catch (error) {
    res.status(404).send({ success: false, message: "Post doesn't exist!" });
  }
};

// createPost function - To create new post
exports.createPost = async (req, res) => {
  try {
    let newPost = new Post(req.body);
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error creating post: ${error.message}`,
    });
  }
};

// Update posts
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id }, req.body, {
      new: true,
    });

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(404);
    res.json({ success: false, message: "Post doesn't exist!" });
    console.log("Error updating post: ", error.message);
  }
};

// deletePost function - To delete post by id
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    if (!post) {
      res.status(404).json({ success: false, message: "Post doesn't exist!" });
    } else {
      await post.deleteOne();
      res
        .status(200)
        .json({ success: true, message: "Post successfully deleted", post });
    }
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
