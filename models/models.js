const mongoose = require("mongoose");

const userData = new mongoose.Schema({
  userName: {
    type: String,
    unique: true,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
  },
  address: {
    type: String,
  },
  token: {
    type: String,
  },
});

const users = mongoose.model("user", userData);

module.exports = { users };
