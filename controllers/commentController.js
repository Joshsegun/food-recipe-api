const Comment = require("../models/commentModel");
const ErrorHandler = require("../utils/errorHandler");
const asyncAwaitHandler = require("../utils/asyncAwaitHandler");
const Recipe = require("../models/recipeModel");

exports.getAllComments = async (req, res) => {
  const comments = await Comment.find();

  res.status(200).json({
    status: "success",
    results: comments.length,
    comments,
  });
};

exports.getComment = asyncAwaitHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment)
    return next(new ErrorHandler("This comment cannot be found", 404));

  res.status(200).json({
    status: "success",
    comment,
  });
});

exports.createComment = asyncAwaitHandler(async (req, res, next) => {
  const user = req.user;

  const { comment, recipeId } = req.body;

  const recipe = await Recipe.findById(recipeId);

  if (!recipeId) return next(new ErrorHandler("Recipe Not found", 404));

  const text = await Comment.create({
    comment,
    user,
    recipe: recipeId,
  });

  recipe.comments.push(text._id);
  await recipe.save();

  res.status(201).json({
    status: "success",
    text,
  });
});

exports.updateComment = asyncAwaitHandler(async (req, res, next) => {
  const newComment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!newComment) return next(new ErrorHandler("The id doesnt exist", 404));

  res.status(200).json({
    status: "success",
    comment: newComment,
  });
});

exports.deleteComment = asyncAwaitHandler(async (req, res, next) => {
  const comment = await Comment.findByIdAndDelete(req.params.id);

  if (!comment) return next(new ErrorHandler("The id doesn't exist", 404));

  res.status(200).json({
    status: "success",
    message: "Deleted Successfully",
  });
});
