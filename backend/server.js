require('dotenv').config();
require('./api/config');

const express = require('express');
const cors = require('cors');
const User = require('./api/models/User');

const app = express();

app.use(express.json());
app.use(cors());

app.post('/register', async (req, res) => {
  let user = new User(req.body);
  let result = await user.save();
  res.send(result);
});

app.listen(5000);