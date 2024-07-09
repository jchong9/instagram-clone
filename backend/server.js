require('dotenv').config();
require('./api/config');

const express = require('express');
const cors = require('cors');
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

app.post("add-post", async (req, res) => {
  let post = new Post(req.body);
  let result = await post.save();
});

app.listen(5000);