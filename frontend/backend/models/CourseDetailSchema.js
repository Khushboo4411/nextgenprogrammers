const mongoose = require("mongoose");

const CourseDetailSchema = new mongoose.Schema({
  courseId: String,
  image: String,
  title: String,
  description: String,
  duration: String,
  rating: Number,
  price: String,
  discount: String,
  tag: String,

  projects: [String],
  skills: [String],
  youtubeLink: String,
  lectures: [
  {
    title: String,
    youtubeLink: String,
  }
]
});


module.exports = mongoose.model(
  "CourseDetail",
  CourseDetailSchema
);