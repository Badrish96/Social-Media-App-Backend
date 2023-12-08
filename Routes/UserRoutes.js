const userController = require("../Controllers/UserController");
const { authMiddleware } = require("../Middleware");

module.exports = function (app) {
  app.get("/social/api/v1/auth/getuser/:id", userController.getUser);
  app.put(
    "/social/api/v1/auth/updateuser/:id",
    authMiddleware.verifyToken,
    authMiddleware.adminCheck,
    userController.updateUser
  );
  app.delete(
    "/social/api/v1/auth/deleteuser/:id",
    authMiddleware.verifyToken,
    authMiddleware.adminCheck,
    userController.deleteUser
  );
  app.put(
    "/social/api/v1/auth/follow/:id",
    authMiddleware.verifyToken,
    userController.followUser
  );
  app.put(
    "/social/api/v1/auth/unfollow/:id",
    authMiddleware.verifyToken,
    userController.unFollowUser
  );
};
