const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required for creating a user"],
    trim: true,
    lowercase: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email address.",
    ],
    unique: [true, "email already exists"],
  },
  name: {
    type: String,
    required: [true, "name is requird for user "],
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required for creating a account"],
    minlength:[6,'Password should be contain 6 Character']
    ,select:false
  },
  Timestamp:true
});
