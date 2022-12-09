const Comment = require("../models/CommentModel");
const Post = require("../models/PostModel");

// get all comments
exports.allComments = async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json({ success: true, message: "All comments", comments });
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
    });
    // save comment
    await comment.save();
    // get this particular post
    const postRelated = await Post.findById(id);
    // push the comment into the post.comments array
    postRelated.comments.push(comment);
    // save and redirect...
    await postRelated.save(function (err) {
      if (err) {
        console.log(err);
      }
      //   res.redirect("/");
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
