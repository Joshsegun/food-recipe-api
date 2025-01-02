const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please input your fullname"],
  },
  username: {
    type: String,
    unique: true,
    required: [true, "Choose a username"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required, Please input your email"],
    validate: [validator.isEmail, "Please input a valid email"],
  },
  password: {
    type: String,
    required: [true, "Password is required, Please input a password"],
    minLength: [8, "Password must be at least 8 characters long"],
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (pass) {
        return pass === this.password;
      },
      message: "Password does not match",
    },
  },
});

//Pre('save)hook
//Remove passwordConfirm before saving to the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); //Check if password has been changed

  this.password = await bcrypt.hash(this.password, 12); //Hashing the password before it saves

  this.passwordConfirm = undefined;

  next();
});

// Method to check if the password matches with the one in database
userSchema.methods.correctPassword = async function (
  candidatePassword,
  hashedPassword
) {
  return await bcrypt.compare(candidatePassword, hashedPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
