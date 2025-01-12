const Recipe = require("../models/recipeModel");
const ErrorHandler = require("../utils/errorHandler");
const asyncAwaitHandler = require("../utils/asyncAwaitHandler");

exports.getAllRecipes = async (req, res) => {
  const recipes = await Recipe.find();

  res.status(200).json({
    status: "success",
    results: recipes.length,
    recipes,
  });
};

exports.getRecipe = asyncAwaitHandler(async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe)
    return next(new ErrorHandler("This recipe cannot be found", 404));

  res.status(200).json({
    status: "success",
    recipe,
  });
});

exports.createRecipe = async (req, res) => {
  const recipe = await Recipe.create(req.body);

  res.status(201).json({
    status: "success",
    recipe,
  });
};

exports.updateRecipe = asyncAwaitHandler(async (req, res, next) => {
  const newRecipe = await Recipe.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      description: req.body.description,
      ingredients: req.body.ingredients,
      steps: req.body.steps,
      cookingTime: req.body.cookingTime,
      category: req.body.category,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  // const newRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
  //   new: true,
  //   runValidators: true,
  // });

  if (!newRecipe) return next(new ErrorHandler("The id doesnt exist", 404));

  res.status(200).json({
    status: "success",
    recipe: newRecipe,
  });
});

exports.deleteRecipe = asyncAwaitHandler(async (req, res, next) => {
  const recipe = await Recipe.findByIdAndDelete(req.params.id);

  if (!recipe) return next(new ErrorHandler("The id doesn't exist", 404));

  res.status(200).json({
    status: "success",
    message: "Deleted Successfully",
  });
});

exports.likeRecipe = asyncAwaitHandler(async (req, res, next) => {
  //Get logged in user
  const currentUserId = req.user._id;

  //Get recipe id
  const { recipeId } = req.params;

  // const recipe = await Recipe.findByIdAndUpdate(
  //   req.params.id,
  //   { $addToSet: { likes: currentUserId } },
  //   { new: true }
  // );

  const recipe = await Recipe.findById(recipeId);

  if (!recipe) return next(new ErrorHandler("Recipe not found", 404));

  if (recipe.likes.includes(currentUserId))
    return next(new ErrorHandler("You have already liked this recipe", 400));

  //Add the user id to the likes array
  recipe.likes.push(currentUserId);
  await recipe.save();

  res.status(200).json({
    status: "success",
    message: "Recipe liked",
    recipe,
  });
});

// Unlike a Recipe
exports.unlikeRecipe = asyncAwaitHandler(async (req, res, next) => {
  const currentUserId = req.user._id; // User ID from authentication middleware

  const { recipeId } = req.params;

  // const recipe = await Recipe.findByIdAndUpdate(
  //   req.params.id,
  //   { $pull: { likes: currentUserId } },
  //   { new: true }
  // );

  const recipe = await Recipe.findById(recipeId);

  if (!recipe) return next(new ErrorHandler("Recipe not found", 404));

  if (!recipe.likes.includes(currentUserId))
    return next(new ErrorHandler("You have not liked this recipe yet", 400));

  //Use filtering to remove the userid from the array
  recipe.likes = recipe.likes.filter(
    (id) => id.toString() !== currentUserId.toString()
  );
  await recipe.save();

  res.status(200).json({
    status: "success",
    message: "Recipe unliked successfully",
    recipe,
  });
});

//Get liked recipes by a user
exports.getLikedRecipes = asyncAwaitHandler(async (req, res, next) => {
  //Get the user id
  const { userId } = req.params;

  if (!userId) return next(new ErrorHandler("User not found", 404));

  const likedRecipes = await Recipe.find({ likes: userId }).select("title");

  console.log(likedRecipes[0].likes.length);

  if (likedRecipes.length === 0)
    return next(new ErrorHandler("User has not liked any recipe", 404));

  res.status(200).json({
    status: "success",
    message: "Liked recipes retrieved",
    likedRecipes,
  });
});
