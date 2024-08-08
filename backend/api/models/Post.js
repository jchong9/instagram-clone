const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userID: mongoose.Schema.Types.ObjectId,
  username: String,
  imageURL: String,
  caption: String,
  likedBy: [mongoose.Schema.Types.ObjectId]
});

module.exports = mongoose.model("posts", postSchema);