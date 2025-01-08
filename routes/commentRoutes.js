const express = require("express");
const commentController = require("../controllers/commentController");

const router = express.Router();

router
  .route("/")
  .post(commentController.createRecipe)
  .get(commentController.getAllRecipes);

router
  .route("/:id")
  .get(commentController.getRecipe)
  .patch(commentController.updateRecipe)
  .delete(commentController.deleteRecipe);

module.exports = router;
