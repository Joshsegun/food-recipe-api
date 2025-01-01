// ()
const express = require("express");

const recipeRouter = require("./routes/recipeRoutes");
const userRouter = require("./routes/userRoutes");
const ErrorHandler = require("./utils/errorHandler");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

app.use(express.json());

app.use("/api/v1/recipes", recipeRouter);
app.use("/api/v1/users", userRouter);

app.use("*", (req, res, next) => {
  next(
    new ErrorHandler(
      `${req.originalUrl} does not exist on this server...Check the url properly`,
      404
    )
  );
});

app.use(globalErrorHandler);

module.exports = app;
