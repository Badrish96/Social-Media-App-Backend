const authController = require("../Controllers/AuthController");

module.exports = function (app) {
  app.post("/social/api/v1/auth/register", authController.registerUser);
  app.post("/social/api/v1/auth/login", authController.login);
};
