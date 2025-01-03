const { promisify } = require("util");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const asyncAwaitHandler = require("../utils/asyncAwaitHandler");
const jwt = require("jsonwebtoken");

exports.authenticate = asyncAwaitHandler(async (req, res, next) => {
  //1) Check if token is there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new ErrorHandler("You are not logged in, Pleae log in to get access", 401)
    );
  }

  //Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //Check if user exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new ErrorHandler("User not found", 401));
  }

  //Grant access to the protected route and make req.user = current user
  req.user = currentUser;
  next();
});
