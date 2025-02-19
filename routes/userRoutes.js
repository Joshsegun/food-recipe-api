const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const recipeRouter = require("./recipeRoutes");

const router = express.Router({ mergeParams: true });

router.use("/:userId/recipes", recipeRouter);

router.route("/register").post(authController.register);
router.route("/login").post(authController.login);
router
  .route("/profile")
  .get(authMiddleware.authenticate, userController.profile);

router.route("/forgotPassword").post(authController.forgotPassword);

router.route("/resetPassword/:token").post(authController.resetPassword);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
