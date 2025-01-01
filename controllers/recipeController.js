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
