const express = require("express");
const recipeController = require("../controllers/recipeController");
// const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router
  .route("/")
  .post(recipeController.createRecipe)
  .get(authMiddleware.authenticate, recipeController.getAllRecipes);

router
  .route("/:id")
  .get(recipeController.getRecipe)
  .patch(recipeController.updateRecipe)
  .delete(recipeController.deleteRecipe);

module.exports = router;
