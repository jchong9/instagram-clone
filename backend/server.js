require('dotenv').config();
require('./api/config');

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const User = require('./api/models/User');
const Post = require('./api/models/Post');

const app = express();

app.use(express.json());
app.use(cors());

app.post('/register', async (req, res) => {
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password;
  res.send(result);
});

app.post('/login', async (req, res) => {
  if (req.body.password && req.body.email) {
    let user = await User.findOne(req.body).select("-password");
    if (user) {
      res.send(user);
    }
    else {
      res.send({result: "user not found"});
    }
  }
  else {
    res.send({result: "user not found"});
  }
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
    let post = new Post(req.body);
    let result = await post.save();
    result = result.toObject();
    res.send(result);
  }
});

app.get("/get-image", async (req, res) => {
  try {
    Post.find({}).sort({$natural: -1}).limit(20).then(data => res.send(data));
  } catch(err) {
    res.json({status: "error"});
  }
});

app.get('/get-user', async (req, res) => {
  try {
    User.findOne(req.query).then(data => res.send(data));
  } catch(err) {
    res.json({status: "error"});
  }
});

app.listen(5000);