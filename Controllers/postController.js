const { default: mongoose } = require("mongoose");
const postModel = require("../Models/postModel");
const userModel = require("../Models/userModel");

exports.createPost = async (req, res) => {
  const newPost = new postModel(req.body);

  try {
    const updatedPost = await newPost.save();
    res.status(200).send(updatedPost);
  } catch (err) {
    res.status(500).send({
      message: "Error while adding the post",
    });
  }
};

exports.getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await postModel.findById(id);
    res.status(200).send(post);
  } catch (err) {
    res.status(500).send({
      message: "Error while getting the post",
    });
  }
};

exports.updatePost = async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;

  try {
    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).send({
        message: "Post not found",
      });
    }

    if (post.userId === userId) {
      await post.updateOne({ $set: req.body });

      res.status(200).send("Post has been updated");
    } else {
      res.status(403).send({
        message: "Request forbidden",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Error while updating the post",
    });
  }
};

exports.deletePost = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;

  try {
    const post = await postModel.findById(id);
    if (post.userId === userId) {
      await post.deleteOne();
      res.status(200).send({
        message: "Post deleted",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Error while deleting the post",
    });
  }
};

exports.likePost = async (req, res) => {
  const id = req.params.id;

  const { userId } = req.body;
  try {
    const post = await postModel.findById(id);

    if (!post.likes.includes(userId)) {
      await post.updateOne({ $push: { likes: userId } });
      res.status(200).send({
        message: "Post liked",
      });
    } else {
      await post.updateOne({ $pull: { likes: userId } });
      res.status(200).send({
        message: "Post disliked",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Error while liking the post",
    });
  }
};

exports.getTimelinePosts = async (req, res) => {
  const userId = req.params.id;

  try {
    const currentUserPosts = await postModel.find({ userId: userId });
    const followingPosts = await userModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "following",
          foreignField: "userId",
          as: "followingPosts",
        },
      },
      {
        $project: {
          followingPosts: 1,
          _id: 0,
        },
      },
    ]);
    res.status(200).send(
      currentUserPosts
        .concat(...followingPosts[0].followingPosts)
        .sort((a, b) => {
          return b.createdAt - a.createdAt;
        })
    );
  } catch (err) {
    res.status(500).send({
      message: "Error while getting the timeline post",
    });
  }
};
