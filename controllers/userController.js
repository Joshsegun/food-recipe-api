const User = require("../models/userModel");
const asyncAwaitHandler = require("../utils/asyncAwaitHandler");
const ErrorHandler = require("../utils/errorHandler");

exports.getAllUsers = asyncAwaitHandler(async (req, res, next) => {
  const user = await User.find({}, "username name email");

  res.status(200).json({
    status: "success",
    results: user.length,
    user,
  });
});

exports.getUser = asyncAwaitHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user)
    return next(new ErrorHandler("The user with this ID does not exist", 401));

  res.status(200).json({
    status: "success",
    user,
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "The route is not defined, Use /signup instead",
  });
};

exports.updateUser = asyncAwaitHandler(async (req, res, next) => {
  const { username, name, email } = req.body;

  const newUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      name,
      username,
      email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!newUser) return next(new ErrorHandler("This user does not exist", 404));

  res.status(200).json({
    status: "success",
    user: newUser,
  });
});

exports.deleteUser = asyncAwaitHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) return next(new ErrorHandler("The user does not exists", 404));

  res.status(200).json({
    status: "success",
    message: "Deleted Successfully",
  });
});
