const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncAwaitHandler = require("../utils/asyncAwaitHandler");

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


  newUser.password = undefined;

  res.status(200).json({
    status: "success",
    token,
    data: {
      newUser,
    },
  });
});
