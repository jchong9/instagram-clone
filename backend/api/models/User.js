const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  bio: String,
  following: [mongoose.Schema.Types.ObjectId],
  followers: [mongoose.Schema.Types.ObjectId]
});

module.exports = mongoose.model("users", userSchema);