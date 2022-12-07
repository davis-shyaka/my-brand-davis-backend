const mongoose = require("mongoose");

const schema = mongoose.Schema({
  title: String,
  caption: String,
  author: String,
  content: String,
});

module.exports = mongoose.model("Post", schema);
