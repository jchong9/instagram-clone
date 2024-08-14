require('dotenv').config();
require('./api/config');

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const User = require('./api/models/User');
const Post = require('./api/models/Post');
const Comment = require('./api/models/Comment')

const app = express();

app.use(express.json());
app.use(cors());

//POST METHODS

app.post('/register', async (req, res) => {
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password;
  res.send(result);
});

app.post('/login', async (req, res) => {
  let user = await User.findOne(req.body).select("-password");
  res.send(user);
});

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, '../frontend/src/images/userContent');
  },
  filename: function(req, file, cb) {
    const uniquePrefix = Date.now();
    cb(null, uniquePrefix + '-' + file.originalname);
  }
});

const upload = multer({storage: storage});

app.post("/upload-image", upload.single("image"),  async (req, res) => {
  if (req.file != null) {
    req.body.imageURL = req.file.filename;
    req.body.likedBy = [];
    let post = new Post(req.body);
    let result = await post.save();
    result = result.toObject();
    res.send(result);
  }
});

app.post('/add-comment', async (req, res) => {
  let comment = new Comment(req.body);
  let result = await comment.save();
  result = result.toObject();
  res.send(result);
});

//GET METHODS

app.get("/get-image", async (req, res) => {
  try {
    Post.find({}).sort({
      $natural: -1
    }).limit(20).then(data => res.send(data));
  }
  catch(err) {
    res.json({status: "error"});
  }
});

app.get("/get-image-search", async (req, res) => {
  try {
    const searchQuery = req.query.search;
    Post.find({
      $or:[
        {username: searchQuery},
        {caption: searchQuery}
      ]
    }).sort({
      $natural: -1
    }).limit(20).then(data => res.send(data));
  }
  catch(err) {
    res.json({status: "error"});
  }
});

app.get("/get-image-user", async (req, res) => {
  try {
    const userID = req.query.id;
    Post.find({
      userID: userID
    }).sort({
      $natural: -1
    }).limit(20).then(data => res.send(data));
  }
  catch(err) {
    res.json({status: "error"});
  }
});

app.get("/get-image-following", async (req, res) => {
  try {
    const loggedUser = req.query.id;
    const followingList = req.query.following;
    Post.find({
      userID: {$in: [...followingList, loggedUser]}
    }).sort({
      $natural: -1
    }).limit(20).then(data => res.send(data));
  }
  catch(err) {
    res.json({status: "error"});
  }
});

app.get("/get-image-recommendation", async (req, res) => {
  try {
    const followingList = req.query.following;
    Post.find({
      likedBy: {$in: followingList}
    }).sort({
      $natural: -1
    }).limit(20).then(data => res.send(data));
  }
  catch(err) {
    res.json({status: "error"});
  }
});

app.get('/get-user', async (req, res) => {
  try {
    const userID = req.query.id;
    User.findOne({
      _id: userID
    }).then(data => res.send(data));
  }
  catch(err) {
    res.json({status: "error"});
  }
});

app.get('/get-comments', async (req, res) => {
  try {
    const postID = req.query.id;
    Comment.find({
      postID
    }).sort({
      $natural: -1
    }).limit(20).then(data => res.send(data));
  }
  catch(err) {
    res.json({status: "error"});
  }
});

app.get("/get-username", async (req, res) => {
  try {
    const username = req.query.username;
    let registeredUser = await User.findOne({
      username
    });
    if (registeredUser) {
      res.send(true);
    }
    else {
      res.send(false);
    }
  }
  catch(err) {
    res.send(false);
  }
});

app.get("/get-email", async (req, res) => {
  try {
    const email = req.query.email;
    let registeredUser = await User.findOne({
      email
    });
    if (registeredUser) {
      res.send(true);
    }
    else {
      res.send(false);
    }
  }
  catch(err) {
    res.send(false);
  }
});

// PUT AND PATCH METHODS

app.patch("/update-user", async (req, res) => {
  try {
    const userID = req.query.id;
    const user = await User.findByIdAndUpdate({
      _id: userID
    }, req.body, {
      new: true
    });
    res.send(user);
  }
  catch (err) {
    res.status(500).json({error: "something went wrong"});
  }
});

app.patch("/add-follow", async (req, res) => {
  try {
    const followerID = req.body.follower;
    const followeeID = req.body.followee;
    const updatedFollowee = await User.findOneAndUpdate({
      _id: followeeID
    }, {$addToSet: {followers: followerID}}, {
      new: true
    });
    const updatedFollower = await User.findOneAndUpdate({
      _id: followerID
    }, {$addToSet: {following: followeeID}}, {
      new: true
    });
    res.send({followee: updatedFollowee, follower: updatedFollower});
  }
  catch (err) {
    res.status(500).json({error: "something went wrong"});
  }
});

app.patch("/remove-follow", async (req, res) => {
  try {
    const followerID = req.body.follower;
    const followeeID = req.body.followee;
    const updatedFollowee = await User.findOneAndUpdate({
      _id: followeeID
    }, {$pull: {followers: followerID}}, {
      new: true
    });
    const updatedFollower = await User.findOneAndUpdate({
      _id: followerID
    }, {$pull: {following: followeeID}}, {
      new: true
    });
    res.send({followee: updatedFollowee, follower: updatedFollower});
  }
  catch (err) {
    res.status(500).json({error: "something went wrong"});
  }
});

app.patch("/add-like", async (req, res) => {
  try {
    const postID = req.body.imageID;
    const userID = req.body.userID;
    const post = await Post.findOneAndUpdate({
      _id: postID
    }, {$addToSet: {likedBy: userID}}, {
      new: true
    });
    res.send(post);
  }
  catch (err) {
    res.status(500).json({error: "something went wrong"});
  }
});

app.patch("/remove-like", async (req, res) => {
  try {
    const postID = req.body.imageID;
    const userID = req.body.userID;
    const post = await Post.findOneAndUpdate({
      _id: postID
    }, {$pull: {likedBy: userID}}, {
      new: true
    });
    res.send(post);
  }
  catch (err) {
    res.status(500).json({error: "something went wrong"});
  }
});

app.listen(5000);