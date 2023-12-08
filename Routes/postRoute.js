const postController = require("../Controllers/postController");

module.exports = function (app) {
  app.post("/social/api/v1/auth/post", postController.createPost);
  app.get("/social/api/v1/auth/getpost/:id", postController.getPost);
  app.put("/social/api/v1/auth/updatepost/:id", postController.updatePost);
  app.delete("/social/api/v1/auth/deletepost/:id", postController.deletePost);
  app.put("/social/api/v1/auth/likepost/:id", postController.likePost);
  app.get(
    "/social/api/v1/auth/timelinepost/:id",
    postController.getTimelinePosts
  );
};
