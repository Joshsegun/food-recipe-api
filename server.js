// ()
const mongoose = require("mongoose");
const dotenv = require("dotenv");

//Configuration path
dotenv.config({ path: "./config.env" });
const app = require("./app.js");

// const DB = process.env.DATABASE.replace(
//   "<PASSWORD>",
//   process.env.DATABASE_PASSWORD
// );

const DB = process.env.DATABASE_LOCAL;

// Connecting to the database
mongoose
  .connect(DB,)
  .then(() =>
    console.log("Connection is successful, Time to unleash the data power.")
  );

//Connecting to the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is live, Connecting and Logging to Port ${port}`);
});
