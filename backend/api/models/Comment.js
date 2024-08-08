const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  postID: mongoose.Schema.Types.ObjectId,
  userID: mongoose.Schema.Types.ObjectId,
  username: String,
  content: String
});

module.exports = mongoose.model("comments", commentSchema);