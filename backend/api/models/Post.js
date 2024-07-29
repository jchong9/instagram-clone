const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userID: mongoose.Schema.Types.ObjectId,
  imageURL: String,
  caption: String
});

module.exports = mongoose.model("posts", postSchema);