const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  ingredients: [
    {
      type: String,
      required: true,
    },
  ],
  steps: [
    {
      type: String,
      required: true,
    },
  ],
  cookingTime: {
    type: Number,
  },
  category: {
    type: String,
    default: "breakfast",
  },
  tags: [
    {
      type: String,
    },
  ],
  image: {
    type: String,
    // required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  // createdBy: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User",
  // },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// recipeSchema.virtual("comments", {
//   ref: "Comment",
//   foreignField: "recipe",
//   localField: "_id",
// });

recipeSchema.pre(/^find/, function (next) {
  this.populate({
    path: "comments",
    select: "text",
  }).populate({
    path: "likes",
    select: "name username",
  });

  next();
});

recipeSchema.index({ likes: 1 });

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
