const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/register").post(authController.register);
router.route("/login").post(authController.login);
router
  .route("/profile")
  .get(authMiddleware.authenticate, userController.profile);

  router.route("/forgotPassword").post(authController.forgotPassword)

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
