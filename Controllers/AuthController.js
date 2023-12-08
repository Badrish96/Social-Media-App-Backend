const userModel = require("../Models/userModel");
const bcrypt = require("bcryptjs");
const authConfig = require("../configs/authConfig");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  const hashedPass = bcrypt.hashSync(req.body.password, 10);

  // Check if username already exists in the database
  const existingUser = await userModel.findOne({ username: req.body.username });
  if (existingUser) {
    return res.status(403).json({
      message: "Try any other username, this username is already registered!",
    });
  }

  const newUser = {
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: hashedPass,
  };
  try {
    const userCreated = await userModel.create(newUser);
    const postResponse = {
      username: userCreated.username,
      password: userCreated.password,
      firstName: userCreated.firstName,
      lastName: userCreated.lastName,
      createdAt: userCreated.createdAt,
      updatedAt: userCreated.updatedAt,
    };
    res.status(200).send(postResponse);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: `${err} while registering`,
    });
  }
};

//Function will allow user to Sign in

exports.login = async (req, res) => {
  //fetch user based on the userID provided in req.body
  const user = await userModel.findOne({ username: req.body.username });
  if (user == null) {
    return res.status(400).send({
      message: "This email has not been registered!",
    });
  }
  const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
  if (!isPasswordValid) {
    return res.status(401).send({
      message: "Incorrect Password!",
    });
  }
  //Fetching user info from jwt token
  const token = jwt.sign({ username: user.username }, authConfig.secret, {
    expiresIn: 20000,
  });
  var responseUser = {
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    accessToken: token,
  };
  res.status(200).send(responseUser);
};
