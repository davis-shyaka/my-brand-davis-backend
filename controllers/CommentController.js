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

// posting a comment on the blog
exports.createComment = async (req, res) => {
  try {
    // find out which post you are commenting
    const id = req.params.id;
    // get the comment text and record post id
    const comment = new Comment({
      text: req.body.comment,
      post: id,
      user: req.user.id,
    });
    // save comment
    await comment.save();
    // get this particular post
    const postRelated = await Post.findById(id);
    // push the comment into the post.comments array
    postRelated.comments.push(comment);
    // save and redirect...
    await postRelated.save();
    res.json({
      success: true,
      message: "Comment posted successfully",
      postRelated,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
    console.log("Error posting comment: ", error.message);
  }
};

// delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findOne({ _id: req.params.id });
    await comment.remove();
    res.json({
      success: true,
      message: "Comment deleted succesfully",
      comment,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
