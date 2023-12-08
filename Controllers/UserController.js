const userModel = require("../Models/userModel");
const bcrypt = require("bcryptjs");

exports.getUser = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await userModel.findById(id);

    if (user) {
      const { password, ...otherDetails } = user._doc;

      res.status(200).send(otherDetails);
    } else {
      res.status(404).send({
        message: `No user found with ID ${id}`,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: `${err} while getting user information`,
    });
  }
};

exports.updateUser = async (req, res) => {
  const id = req.params.id;

  const { currentUserID, currentUserAdminStatus, password } = req.body;

  if (id === currentUserID || currentUserAdminStatus) {
    try {
      if (password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }

      const user = await userModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      res.status(200).send(user);
    } catch (err) {
      res.status(500).send({
        message: `${err} while updating user information`,
      });
    }
  } else {
    res.status(404).send({
      message: "Access Denied! you can only update your own profile",
    });
  }
};

exports.deleteUser = async (req, res) => {
  const id = req.params.id;

  const { currentUserID, currentUserAdminStatus } = req.body;

  if (id === currentUserID || currentUserAdminStatus) {
    try {
      const user = await userModel.findByIdAndDelete(id);
      res.status(200).send({
        message: `${user} deleted successfully`,
      });
    } catch (err) {
      res.status(500).send({
        message: "Error while deleting user",
      });
    }
  }
};

exports.followUser = async (req, res) => {
  const id = req.params.id;
  const { currentUserID } = req.body;

  if (currentUserID === id) {
    res.status(404).send({
      message: "Request forbidden",
    });
  } else {
    try {
      const followUser = await userModel.findById(id);
      const followingUser = await userModel.findById(currentUserID);

      if (!followUser.followers.includes(currentUserID)) {
        await followUser.updateOne({ $push: { followers: currentUserID } });
        await followingUser.updateOne({ $push: { following: id } });
        res.status(200).send({
          message: `Following ${id}`,
        });
      } else {
        res.status(500).send({
          message: `Already following ${currentUserID}`,
        });
      }
    } catch (err) {
      res.status(500).send({
        message: "Error while following user",
      });
    }
  }
};

exports.unFollowUser = async (req, res) => {
  const id = req.params.id;
  const { currentUserID } = req.body;

  if (currentUserID === id) {
    res.status(404).send({
      message: "Request forbidden",
    });
  } else {
    try {
      const followUser = await userModel.findById(id);
      const followingUser = await userModel.findById(currentUserID);

      if (followUser.followers.includes(currentUserID)) {
        await followUser.updateOne({ $pull: { followers: currentUserID } });
        await followingUser.updateOne({ $pull: { following: id } });
        res.status(200).send({
          message: `Unfollowed ${id}`,
        });
      } else {
        res.status(500).send({
          message: `Not following ${currentUserID}`,
        });
      }
    } catch (err) {
      res.status(500).send({
        message: "Error while following user",
      });
    }
  }
};
