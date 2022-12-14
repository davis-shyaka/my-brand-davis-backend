const mongoose = require("mongoose");
const Comment = require("../models/CommentModel");

const postSchema = mongoose.Schema({
  cover: String,
  title: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  noOfLikes: {
    type: Number,
    default: 0,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

// postSchema.pre(
//   "deleteMany",
//   { document: false, query: true },
//   async function (next) {
//     const docs = await this.model.find(this.getFilter());
//     const posts = docs.map((item) => item._id);
//     await Comment.deleteMany({ comment: { $in: posts } });
//     next();
//   }
// );

postSchema.pre("remove", function (next) {
  // 'this' is the post being removed. Provide callbacks here if you want
  // to be notified of the calls' result.
  Comment.remove({ post_id: this._id }).exec();
  next();
});

module.exports = mongoose.model("Post", postSchema);
