const mongoose = require("mongoose");

const SignupSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    default: "user"
  },
  profileImage: {
  type: String,
  default: ""
}
});

module.exports = mongoose.model("signups",SignupSchema);