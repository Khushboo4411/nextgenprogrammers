const mongoose = require("mongoose");

const ContactInfoSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
});

module.exports = mongoose.model("contact_infos", ContactInfoSchema);