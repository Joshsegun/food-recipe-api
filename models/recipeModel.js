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
  // likes: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "User",
  //   },
  // ],
  // createdBy: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User",
  // },
  // comments: [
  //   {
  //     user: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "User",
  //     },
  //     comment: String,
  //   },
  // ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
