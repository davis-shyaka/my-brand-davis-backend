const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  status: Boolean,
  date: {
    type: Date,
    default: Date.now,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
});

module.exports = mongoose.model("Like", likeSchema);
