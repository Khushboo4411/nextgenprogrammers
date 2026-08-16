const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "signups",
      default: null,
    },

    userName: {
      type: String,
      default: "",
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },


    type: {
      type: String,
      enum: [
        "signup",
        "profile",
        "course",
        "contact",
        "certificate",
        "assignment",
        "class",
        "admin",
        "general",
      ],
      default: "general",
    },
    link: {
        type: String,
        default: "",
      },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Notification",
  NotificationSchema
);