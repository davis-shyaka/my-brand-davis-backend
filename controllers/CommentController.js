const Comment = require("../models/CommentModel");
const Post = require("../models/PostModel");

// get all comments
exports.allComments = async (req, res) => {
  try {
    // const comments = await Comment.find();
    // res.json({ success: true, message: "All comments", comments });
    let data = await Comment.find().populate({
      path: "post user",
      select: "title surname givenName email",
    });
    res.status(200).json({ data: [...data], success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get individual comment
exports.getComment = async (req, res) => {
  try {
    let comment = await Comment.findOne({ _id: req.params.id });
    if (!comment) {
      res
        .status(404)
        .send({ success: false, message: "Comment doesn't exist!" });
    } else res.status(200).json(comment);
  } catch (error) {
    res.status(404).send({ success: false, message: error.message });
  }
};

// posting a comment on the blog
exports.createComment = async (req, res) => {
  try {
    // find out which post you are commenting
    const id = req.params.id;
    // find out which user is commenting
    const user = req.user;
    if (!id) {
      res
        .status(404)
        .json({ success: false, message: "Must select a post to comment!" });
    } else if (!user) {
      res
        .status(405)
        .json({ success: false, message: "Must be logged in to comment" });
    } else if (id && user) {
      // get the comment text and record post id
      const comment = new Comment({
        comment: req.body.comment,
        post: id,
        user: user.id,
      });
      // handling the actual logic of storing the comment along with the right user and to the right post.
      try {
        // get this particular post
        const postRelated = await Post.findById(id);
        if (!postRelated) {
          res
            .status(404)
            .json({ success: false, message: "Post doesn't exist!" });
        } else {
          // save comment
          await comment.save();
          // push the comment into the post.comments array
          postRelated.comments.push(comment);
          // save and redirect...
          await postRelated.save();
          res.status(201).json(postRelated);
        }
      } catch (error) {
        res.status(404).json({
          success: false,
          message: `The post you are trying to comment on doesn't exist`,
        });
      }
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findOne({ _id: req.params.id });
    if (!comment) {
      res
        .status(404)
        .send({ success: false, message: "Comment doesn't exist!" });
    } else {
      await comment.deleteOne();
      res.json({
        success: true,
        message: "Comment successfully deleted",
        comment,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
