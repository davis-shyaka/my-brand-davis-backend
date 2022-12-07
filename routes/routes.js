const express = require("express");
const Post = require("../models/Post");
const router = express.Router();

// Get all posts
router.get("/posts", async (req, res) => {
  const posts = await Post.find();
  res.send(posts);
});

// Create posts
router.post("/posts", async (req, res) => {
  const post = new Post({
    title: req.body.title,
    caption: req.body.caption,
    content: req.body.content,
  });
  await post.save();
  res.send(post);
});

// Get individual post
router.get("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    res.send(post);
  } catch {
    res.status(404);
    res.send({ error: "Post doesn't exist!" });
  }
});

// Update posts
router.patch("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });

    if (req.body.title) {
      post.title = req.body.title;
    }

    if (req.body.content) {
      post.content = req.body.content;
    }

    await post.save();
    res.send(post);
  } catch {
    res.status(404);
    res.send({ error: "Post doesn't exist!" });
  }
});
// router.put("/posts/:id", async (req, res) => {
//   const post = await Post.findOne({ _id: req.params.id });
//   post.title = req.body.title;
//   post.caption = req.body.caption;
//   post.content = req.body.content;
//   await post.save();
//   res.send(post);
//   console.log(post);
//   return post;
// });

// Delete posts
router.delete("/posts/:id", async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id });
  await post.remove();
  res.send(post);
});

module.exports = router;
