const jwt = require("jsonwebtoken");
const userModel = require("../Models/userModel");
const authConfig = require("../configs/authConfig");

verifyToken = (req, res, next) => {
  let token = req.headers["x-auth-token"];

  if (!token) {
    res.status(500).send({
      message: "No token available",
    });
  }

  jwt.verify(token, authConfig.secret, (err, payload) => {
    if (err) {
      res.status(500).send({
        message: "Please login first",
      });
    }
    req.username = payload.username;
    next();
  });
};

adminCheck = async (req, res, next) => {
  const user = await userModel.findOne({ username: req.username });

  if (user && user.userType == "ADMIN") {
    next();
  } else {
    res.status(500).send({
      message: "Only Admins are allowed",
    });
  }
};

const authFunction = {
  verifyToken: verifyToken,
  adminCheck: adminCheck,
};

module.exports = authFunction;
