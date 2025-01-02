const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncAwaitHandler = require("../utils/asyncAwaitHandler");
const ErrorHandler = require("../utils/errorHandler");

exports.register = asyncAwaitHandler(async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  console.log(token);

  newUser.password = undefined;

  res.status(200).json({
    status: "success",
    token,
    data: {
      newUser,
    },
  });
});

exports.login = asyncAwaitHandler(async (req, res, next) => {
  //Check if username and password exists
  const { username, password } = req.body;

  //
  if (!username || !password)
    return next(new ErrorHandler("Please input a username and password", 401));

  // Check if the username and password correlate with the one in the database
  const user = await User.findOne({ username }).select("+password");

  // Check if the passwords match
  // const passwordMatch = await user.correctPassword(password, user.password);

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new ErrorHandler("Incorrect username or password", 400));

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(200).json({
    status: "success",
    user,
    token,
  });
});
