require('dotenv').config();
require('./api/config');

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const User = require('./api/models/User');
const Post = require('./api/models/Post');
const Comment = require('./api/models/Comment')
const {Types} = require("mongoose");

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

app.get('/search/users/:query?', async (req, res) => {
  try {
    const username = req.params.query;
    const page = req.query.page;
    const limit = req.query.limit;
    const totalUsers = await User.countDocuments({username: new RegExp(username, 'i')});
    const totalPages = Math.ceil(totalUsers / limit);
    const offset = (page - 1) * limit;

    const users = await User.find({
      username: new RegExp(username, 'i')
    }).skip(offset).limit(limit);

    res.json({
      users,
      totalPages,
    });
  }
  catch(err) {
    res.json({status: "Cannot find users based on query"});
  }
});

app.get('/users/:id', async (req,res) => {
  try {
    const query = req.params.id;
    User.findOne({
      $or: [
        {_id: Types.ObjectId.isValid(query) ? query : undefined},
        {username: query},
        {email: query}
      ]
    }).then(data => res.send(data));
  }
  catch(err) {
    res.json({status: "Cannot find user"});
  }
});

app.patch('/users/:id', async (req,res) => {
  try {
    const userID = req.params.id;
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

app.post('/posts', upload.single('image'), async (req, res) => {
  if (req.file != null) {
    req.body.imageURL = req.file.filename;
    req.body.likedBy = [];
    let post = new Post(req.body);
    let result = await post.save();
    result = result.toObject();
    res.send(result);
  }
});

app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({$natural: -1});

    res.json({
      posts
    });
  }
  catch(err) {
    res.json({status: "Cannot find all posts"});
  }
});

app.get('/users/:id/posts', async (req, res) => {
  try {
    const userID = req.params.id;
    const page = req.query.page;
    const limit = req.query.limit;
    const totalPosts = await Post.countDocuments({userID});
    const totalPages = Math.ceil(totalPosts / limit);
    const offset = (page - 1) * limit;

    const posts = await Post.find({
      userID
    }).sort({$natural: -1})
      .skip(offset)
      .limit(limit);

    res.json({
      posts,
      totalPages,
    });
  }
  catch(err) {
    res.json({status: "Cannot find posts based on userID"});
  }
});

app.get('/users/:id/following/posts', async (req, res) => {
  try {
    const userID = req.params.id;
    const followingList = req.query.following ? req.query.following : [];
    const page = req.query.page;
    const limit = req.query.limit;
    const totalPosts = await Post.countDocuments({userID: {$in: [...followingList, userID]}});
    const totalPages = Math.ceil(totalPosts / limit);
    const offset = (page - 1) * limit;

    const posts = await Post.find({
      userID: { $in: [...followingList, userID] }
    }).sort({ $natural: -1 })
      .skip(offset)
      .limit(limit);

    res.json({
      posts,
      totalPages,
    });
  }
  catch(err) {
    res.json({status: "Cannot find posts based on following list"});
  }
});

app.get('/users/:id/recommendations/posts', async (req, res) => {
  try {
    const followingList = req.query.following;
    const page = req.query.page;
    const limit = req.query.limit;
    const totalPosts = await Post.countDocuments({likedBy: {$in: followingList}});
    const totalPages = Math.ceil(totalPosts / limit);
    const offset = (page - 1) * limit;

    const posts = await Post.find({
      likedBy: {$in: followingList}
    }).sort({$natural: -1}).skip(offset).limit(limit);

    res.json({
      posts,
      totalPages,
    });
  }
  catch(err) {
    res.json({status: "Cannot find posts based on recommendations"});
  }
});

app.get('/search/posts/:query?', async (req, res) => {
  try {
    const searchQuery = req.params.query;
    const page = req.query.page;
    const limit = req.query.limit;
    const totalPosts = await Post.countDocuments({
      $or:[
            {username: new RegExp(searchQuery, 'i')},
            {caption: new RegExp(searchQuery, 'i')}
      ],
    });
    const totalPages = Math.ceil(totalPosts / limit);
    const offset = (page - 1) * limit;

    const posts = await Post.find({
      $or:[
        {username: new RegExp(searchQuery, 'i')},
        {caption: new RegExp(searchQuery, 'i')}
      ],
    }).sort({ $natural: -1 })
      .skip(offset
      ).limit(limit);

    res.json({
      posts,
      totalPages,
    });
  }
  catch(err) {
    res.json({status: "Cannot find posts based on search query"});
  }
});

app.post('/comments', async (req, res) => {
  let comment = new Comment(req.body);
  let result = await comment.save();
  result = result.toObject();
  res.send(result);
});

app.get('/posts/:id/comments', async (req, res) => {
  try {
    const postID = req.params.id;
    const cursor = req.query.cursor;
    const limit = req.query.limit;

    const query = cursor
      ? {_id: {$lt: new Types.ObjectId(cursor)}, postID: postID}
      : {postID: postID};
    const comments = await Comment.find(query)
      .sort({_id: -1})
      .limit(Number(limit) + 1); // fetch an extra comment to see if there are more

    const hasMoreComments = comments.length > limit;
    if (hasMoreComments) {
      comments.pop();
    }

    res.json({
      comments,
      nextCursor: hasMoreComments ? comments[comments.length - 1]._id : null,
    });
  }
  catch(err) {
    console.error("Error fetching comments: " + err);
    res.json({status: "Server failed to fetch comments"});
  }
});


app.listen(5000);