const mongoose = require("mongoose");

const EnrollmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "signups",
      required: true,
    },

    // Mongo _id
    courseMongoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseDetail",
      required: true,
    },

    // Custom courseId (MERN001 etc.)
    courseId: {
      type: String,
      required: true,
    },

    progress: {
      type: Number,
      default: 0,
    },

    completedLectures: {
      type: Number,
      default: 0,
    },

    totalLectures: {
      type: Number,
      default: 0,
    },

    certificateEarned: {
      type: Boolean,
      default: false,
    },

    enrolledAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create unique index for userId and courseMongoId to prevent duplicates
EnrollmentSchema.index({ userId: 1, courseMongoId: 1 }, { unique: true });

module.exports = mongoose.model(
  "Enrollment",
  EnrollmentSchema
);