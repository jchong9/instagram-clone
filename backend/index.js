require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();

const connectDB = async () => {
  mongoose.connect(process.env.DATABASE_URL);
  const userSchema = new mongoose.Schema({});
  const user = mongoose.model("users", userSchema);
  const data = await user.find();
  console.warn(data);
}

app.get("/", (req, res) => {
  res.send("app is working...");
});

app.listen(5000);