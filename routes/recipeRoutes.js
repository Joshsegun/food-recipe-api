const express = require("express");
const recipeController = require("../controllers/recipeController");

const router = express.Router();

router
  .route("/")
  .post(recipeController.createRecipe)
  .get(recipeController.getAllRecipes);

router
  .route("/:id")
  .get(recipeController.getRecipe)
  .patch(recipeController.updateRecipe)
  .delete(recipeController.deleteRecipe);

module.exports = router;
