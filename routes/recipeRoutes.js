const express = require("express");
const recipeController = require("../controllers/recipeController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware.authenticate)

router.post('/:id/like', recipeController.likeRecipe)
router.post('/:id/unlike', recipeController.unlikeRecipe)

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
