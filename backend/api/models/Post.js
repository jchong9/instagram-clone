const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  imageURL: String
});

module.exports = mongoose.model("posts", postSchema);