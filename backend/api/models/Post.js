const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  imageURL: String,
  userID: String,
  description: String,
  likes: [String],
  created: String,
});

module.exports = mongoose.model("posts", postSchema);