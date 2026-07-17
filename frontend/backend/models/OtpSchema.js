const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },

  otp: {
    type: String,
    required: true,
  },

  purpose: {
    type: String,
    enum: ["signup", "forgot"],
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // 5 minutes
  },
});

module.exports =
  mongoose.model(
    "OTP",
    OTPSchema
  );