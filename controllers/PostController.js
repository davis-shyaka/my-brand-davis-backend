const Post = require("../models/PostModel");

// Get all posts
exports.allPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.json({ success: true, message: "All Posts", posts });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Create posts
exports.createPost = async (req, res) => {
  try {
    const { title, caption, content } = req.body;
    const post = await Post({
      title,
      caption,
      content,
    });
    await post.save();
    res.json({ success: true, message: "Created post successfully", post });
  } catch (error) {
    res.json({ success: false, message: error.message });
    console.log("Error creating post: ", error.message);
  }
};

// Get individual post
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    res.send(post);
  } catch (error) {
    res.status(404);
    res.send({ success: false, message: "Post doesn't exist!" });
    console.log("Error fetching post: ", error.message);
  }
};

// Update posts
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    const { title, caption, content } = req.body;
    if (title) {
      post.title = title;
    }

    if (caption) {
      post.caption = caption;
    }
    if (content) {
      post.content = content;
    }

    await post.save();
    res.json({ success: true, message: "Post updated succesfully", post });
  } catch (error) {
    res.status(404);
    res.json({ success: false, message: "Post doesn't exist!" });
    console.log("Error updating post: ", error.message);
  }
};

// Delete posts
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    await post.remove();
    res.json({ success: true, message: "Post deleted succesfully", post });
  } catch (error) {
    // res.status(404);
    res.json({
      success: false,
      message: "Post couldn't be deleted. Try again later.",
    });
    console.log("Error deleting post: ", error.message);
  }
};