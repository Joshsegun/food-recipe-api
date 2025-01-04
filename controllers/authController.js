const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncAwaitHandler = require("../utils/asyncAwaitHandler");
const ErrorHandler = require("../utils/errorHandler");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

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

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.forgotPassword = asyncAwaitHandler(async (req, res, next) => {
  //GET User based on email
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return next(new ErrorHandler("User not found", 404));

  //Generate a reset token
  const resetToken = jwt.sign({ id: user._id }, process.env.JWT_RESET_SECRET, {
    expiresIn: "1h",
  });

  const resetLink = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Request",
    html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password. The link expires in 1 hour.</p>`,
  };

  await transporter.sendMail(mailOptions);

  res.status(200).json({
    status: "success",
    message: "Password reset link sent to your email",
  });

  // return next(
  //   new AppError('There was an error sending the email. Try again later!'),
  //   500
  // );
});
