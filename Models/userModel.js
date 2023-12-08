const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
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
  userType: {
    type: String,
    default: "User",
  },
  profilePicture: {
    type: String,
  },
  coverPicture: {
    type: String,
  },
  about: {
    type: String,
  },
  livesIn: {
    type: String,
  },
  worksAt: {
    type: String,
  },
  relationship: {
    type: String,
  },
  followers: {
    type: [],
  },
  following: {
    type: [],
  },
  createdAt: {
    type: Date,
    default: () => {
      return Date.now();
    },
    immutable: true,
  },
  updatedAt: {
    type: Date,
    default: () => {
      return Date.now();
    },
    immutable: true,
  },
});

module.exports = mongoose.model("Users", UserSchema);
