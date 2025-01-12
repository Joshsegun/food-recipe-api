const express = require("express");
const recipeController = require("../controllers/recipeController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router({ mergeParams: true });

router.use(authMiddleware.authenticate);

router.get("/liked", recipeController.getLikedRecipes);

router.post("/:recipeId/like", recipeController.likeRecipe);
router.post("/:recipeId/unlike", recipeController.unlikeRecipe);

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
