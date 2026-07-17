const express = require('express');
const app = express();

const SignupSchema = require('./models/SignupSchema');
const CourseDetail = require("./models/CourseDetailSchema");
const ContactInfoSchema = require("./models/ContactInfoSchema");
const Enrollment = require("./models/EnrollmentSchema");
const Notification = require("./models/NotificationSchema");
const upload = require("./multer");
const dotenv = require('dotenv');
const axios =require ('axios');
const Razorpay = require("razorpay");
const OTP = require("./models/OtpSchema");
const nodemailer = require("nodemailer");

require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const connectdb = require('./DB');
const cors = require('cors');

connectdb();

app.use(cors({
    origin: "https://bright-shortbread-3fa647.netlify.app",
     methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);
app.use(express.json());

app.use(
  "/uploads",
  express.static("uploads")
);

const auth =
require("./middleware/auth");

// PUBLIC: Get all courses
// ========== COURSE MANAGEMENT APIs (Admin) ==========

//email validation
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((err, success) => {
  if (err) {
    console.log("❌ EMAIL SERVER ERROR:", err.message);
  } else {
    console.log("✅ MAIL SERVER READY");
  }
});

//generate OTP
let otpStore = {};
// TEST EMAIL ENDPOINT
app.get("/test-email", async (req, res) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "test@gmail.com", // Change this to a real email
      subject: "Test Email - NextGen",
      text: "If you receive this, email is working!",
    });
    res.json({ message: "Test email sent successfully" });
  } catch (error) {
    res.status(500).json({ 
      message: "Email send failed", 
      error: error.message 
    });
  }
});

app.post("/send-signup-otp", async (req, res) => {
  try {
    const { email } = req.body;

    const existingUser =
      await SignupSchema.findOne({
        email,
      });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    await OTP.findOneAndUpdate(
      {
        email,
        purpose: "signup",
      },
      {
        email,
        otp,
        purpose: "signup",
        createdAt: new Date(),
      },
      {
        upsert: true,
      }
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "NextGen Signup OTP",
      html: `
      <h2>NextGen Programmers</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>Valid for 5 minutes</p>
      `,
    });

    res.json({
      sent: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// PUBLIC: Verify OTP
app.post( "/verify-signup-otp",
  async (req, res) => {
    try {
      const { email, otp } =
        req.body;

      const data =
        await OTP.findOne({
          email,
          otp,
          purpose:
            "signup",
        });

      if (!data) {
        return res.json({
          verified:
            false,
        });
      }

      await OTP.deleteOne({
        _id: data._id,
      });

      res.json({
        verified:
          true,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);

let forgotOTP = {};

app.post("/send-forgot-otp",
  async (req, res) => {
    try {
      const { email } =
        req.body;

      const user =
        await SignupSchema.findOne({
          email,
        });

      if (!user) {
        return res.status(404).json({
          message:
            "Email not found",
        });
      }

      const otp =
        Math.floor(
          100000 +
            Math.random() *
              900000
        ).toString();

      await OTP.findOneAndUpdate(
        {
          email,
          purpose:
            "forgot",
        },
        {
          email,
          otp,
          purpose:
            "forgot",
          createdAt:
            new Date(),
        },
        {
          upsert:
            true,
        }
      );

      await transporter.sendMail({
        from:
          process.env
            .EMAIL_USER,
        to: email,
        subject:
          "Password Reset OTP",
        html: `
        <h2>Password Reset</h2>
        <h1>${otp}</h1>
        `,
      });

      res.json({
        sent: true,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);

app.post( "/verify-forgot-otp",
  async (req, res) => {
    try {
      const { email, otp } =
        req.body;

      const data =
        await OTP.findOne({
          email,
          otp,
          purpose:
            "forgot",
        });

      if (!data) {
        return res.json({
          verified:
            false,
        });
      }

      res.json({
        verified:
          true,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);


app.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        message: "Email and password required"
      });
    }

    // password encrypt
    const hashedPassword =
      await bcrypt.hash(newPassword, 10);

    // database update
    await SignupSchema.findOneAndUpdate(
      { email },
      {
        password: hashedPassword
      }
    );

    res.json({
      message: "Password updated successfully"
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message
    });
  }
});




app.post("/Signup", async (req, res) => {
  try {

    const { name, email, password, role } = req.body;

    const existingUser =
      await SignupSchema.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "email_exists",
        alert:
          "This email is already registered. Please login or use another email."
      });
    }

    const bcrypt = require("bcrypt");

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const newUser = new SignupSchema({
      name,
      email,
      password: hashedPassword,
      role
    });

    // Save user
    await newUser.save();

    // Welcome notification
    await Notification.create({
      userId: newUser._id,
      title: "Welcome",
      message:
        "Your account has been created successfully.",
      type: "signup",
        link: "/user/dashboard"

    });

    // Admin notification
    await Notification.create({
      title: "New User Registered",
      message:
        `${newUser.name} registered a new account.`,
      type: "signup",
        link: "/admin/Students"

    });

    res.status(201).json({
      message: "success"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "failed"
    });
  }
});
// PUBLIC: Get all course details
app.get("/CourseDetails", async (req, res) => {
  try {
    const data = await CourseDetail.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching course details"
    });
  }
});

// PUBLIC: Get course details by courseId
app.get("/CourseDetails/:id", async (req, res) => {
  try {
    console.log("=== GET COURSEDETAILS ===");
    console.log("Searching for courseId:", req.params.id);

    const course = await CourseDetail.findOne({
      courseId: req.params.id,
    });

    console.log("Course found:", course);
    if (course) {
      console.log("Course _id:", course._id);
      console.log("Course _id type:", typeof course._id);
    }

    res.json(course);
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({
      message: "Course not found"
    });
  }
});

// ========== AUTHENTICATION APIs (User/Public) ==========

// PUBLIC: Register new user




// PUBLIC: User login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "missing_fields"
    });
  }

  try {
    const userexist = await SignupSchema.findOne({ email });

    

   if (!userexist) {
  return res.status(404).json({
    message: "not_found"
  });
}

const isMatch = await bcrypt.compare(
  password,
  userexist.password
);

if (!isMatch) {
  return res.status(401).json({
    message: "incorrect"
  });
}

// JWT create
const token = jwt.sign(
  {
    id: userexist._id,
    role: userexist.role,
    email: userexist.email
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "1d"
  }
);

return res.status(200).json({
  message: "success",
  token: token,        // NEW
  userId: userexist._id,
  role: userexist.role,
  name: userexist.name,
  email: userexist.email
});

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "error"
    });
  }
});

// ========== CONTACT & INQUIRY APIs (Public) ==========

// PUBLIC: Submit contact message
app.post("/contactinfo", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const newMessage = new ContactInfoSchema({
      name,
      email,
      subject,
      message,
    });

    await newMessage.save();

    // Admin notification
    await Notification.create({
      title: "New Contact Message",
      message: `${name} sent a contact request.`,
      type: "contact",
        link: "/admin/messages"

    });

    res.status(200).json({
      message: "Success",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed",
    });
  }
});

// ADMIN: Create new course
app.post("/AddCompleteCourse", async (req, res) => {
  try {
    const existingCourse = await CourseDetail.findOne({
      courseId: req.body.courseId,
    });

    if (existingCourse) {
      return res.status(400).json({
        message: "Course ID already exists",
      });
    }

    const Detail = new CourseDetail({
      courseId: req.body.courseId,
      image: req.body.image,
      title: req.body.title,
      description: req.body.description,
      duration: req.body.duration,
      rating: req.body.rating,
      price: req.body.price,
      discount: req.body.discount,
      tag: req.body.tag,
    });

// Admin notification
await Notification.create({
  title: "New Course Added",
  message: `${detail.title} course added successfully.`,
  type: "course",
  link: "/courses",
});

// All users notification
const users = await SignupSchema.find({
  role: "user",
});

for (const user of users) {
  await Notification.create({
    userId: user._id,
    title: "New Course Available",
    message: `${detail.title} is now available for enrollment.`,
    type: "course",
    link: "/courses",
  });
}



    const detail = new CourseDetail({
      courseId: req.body.courseId,
      image: req.body.image,
      title: req.body.title,
      description: req.body.description,
      duration: req.body.duration,
      rating: req.body.rating,
      price: req.body.price,
      projects: req.body.projects || [],
      skills: req.body.skills || [],
    });

    await detail.save();

    res.status(201).json({
      message: "Course Added Successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error",
    });
  }
});

// PUBLIC: Get complete course with details
app.get("/CompleteCourse/:courseId", async (req, res) => {
  try {

    const course = await CourseDetail.findOne({
      courseId: req.params.courseId,
    });

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const detail = await CourseDetail.findOne({
      courseId: req.params.courseId,
    });

    res.json({
      ...course._doc,
      projects: detail?.projects || [],
      skills: detail?.skills || [],
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error",
    });
  }
});

// ADMIN: Update course details
app.put("/UpdateCompleteCourse/:courseId", async (req, res) => {
  try {
    await CourseDetail.findOneAndUpdate(
      { courseId: req.params.courseId },
      {
        image: req.body.image,
        title: req.body.title,
        description: req.body.description,
        duration: req.body.duration,
        rating: req.body.rating,
        price: req.body.price,
        discount: req.body.discount,
        tag: req.body.tag,
      }
    );

    await CourseDetail.findOneAndUpdate(
      { courseId: req.params.courseId },
      {
        image: req.body.image,
        title: req.body.title,
        description: req.body.description,
        duration: req.body.duration,
        rating: req.body.rating,
        price: req.body.price,
        projects: req.body.projects || [],
        skills: req.body.skills || [],
      }
    );
   
await Notification.create({
  title: "Updated Course Added",
  message: `${CourseDetail.title} course updated successfully.`,
  type: "course",
    link: "/courses"

});
    res.json({
      message: "Course Updated Successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error",
    });
  }
});

// ADMIN: Delete course
app.delete("/Courses/:id", async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);

    if (!deletedCourse) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    await CourseDetail.findOneAndDelete({
      courseId: deletedCourse.courseId,
    });

    await Notification.create({
      title: "Course Deleted",
      message: `${deletedCourse.title} course deleted by admin.`,
      type: "course",
      link: "/courses",
    });

    //user notification for course deletion
    await Notification.create({
  userId: updatedUser._id,
      title: "Course Deleted",
      message: `${deletedCourse.title} course has been deleted.`,
      type: "course",
      link: "/courses",
    });

    res.json({
      message: "Course Deleted Successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed",
    });
  }
});


// ========== ADMIN MANAGEMENT APIs (Admin Only) ==========

// ADMIN: Get admin profile
app.get("/AdminProfile/:id", async (req, res) => {
  try {
    const admin = await SignupSchema.findById(
      req.params.id
    );

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
       profileImage: admin.profileImage,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error",
    });
  }
});

// ADMIN: Update admin profile
app.put("/AdminProfile/:id", async (req, res) => {
  try {
    const updatedAdmin =
      await SignupSchema.findByIdAndUpdate(
        req.params.id,
        {
          name: req.body.name,
          email: req.body.email,
          profileImage:
            req.body.profileImage,
        },
        { new: true }
      );

    res.json({
      message:
        "Profile Updated Successfully",
      admin: updatedAdmin,
    });
  } catch (error) {
    console.log(error);
  }
});

// ========== FILE UPLOAD APIs (User/Admin) ==========

// USER/ADMIN: Upload profile image
app.post("/upload-profile",
  upload.single("image"),
  (req, res) => {
    try {
      res.json({
        imageUrl:
          "http://localhost:2000/uploads/" +
          req.file.filename,
      });
    } catch (error) {
      res.status(500).json({
        message: "Upload Failed",
      });
    }
  }
);

// ADMIN: Get all contact messages
app.get("/Messages", async (req, res) => {
  try {
    const messages = await ContactInfoSchema.find()
      .sort({ _id: -1 });

    res.json(messages);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error fetching messages",
    });
  }
});

app.delete("/Messages/:id", async (req, res) => {
  try {

    const deletedMessage =
      await ContactInfoSchema.findByIdAndDelete(
        req.params.id
      );

    if (!deletedMessage) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Message Deleted Successfully",
    });

  } catch (error) {

    console.log(
      "Delete Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
app.delete("/Messages", async (req, res) => {
  try {

    await ContactInfoSchema.deleteMany({});

    res.status(200).json({
      success: true,
      message:
        "All messages deleted successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ADMIN: Get all students
app.get("/Students", async (req, res) => {
  try {
    const students = await SignupSchema.find(
      { role: "user" },
      { password: 0 }
    );

    res.json(students);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error fetching students",
    });
  }
});

// ADMIN: Delete student
app.delete("/Students/:id", async (req, res) => {
  try {

    const student =
      await SignupSchema.findByIdAndDelete(
        req.params.id
      );

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.json({
      message:
        "Student Deleted Successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error",
    });
  }
});

// ========== USER MANAGEMENT APIs (User Only) ==========

// USER: Get user profile
app.get("/UserProfile/:id", async (req, res) => {
  try {
    const user = await SignupSchema.findById(
      req.params.id
    );
    

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error",
    });
  }
});

// USER: Update user profile
app.put("/UserProfile/:id", async (req, res) => {
  try {
    const updatedUser =
      await SignupSchema.findByIdAndUpdate(
        req.params.id,
        {
          name: req.body.name,
          email: req.body.email,
          profileImage:
            req.body.profileImage,
        },
        { new: true }
      );




    res.json({
      message:
        "Profile Updated Successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error",
    });
  }
});
// ========== ENROLLMENT APIs (User/Student) ==========

// USER: Enroll in a course
app.post("/EnrollCourse", async (req, res) => {
  try {
    let {
      userId,
      courseMongoId,
      courseId,
    } = req.body;

    console.log("=== ENROLL COURSE REQUEST ===");
    console.log("Raw userId:", userId, "Type:", typeof userId);
    console.log("Raw courseMongoId:", courseMongoId, "Type:", typeof courseMongoId);
    console.log("Raw courseId:", courseId);

    // Convert to ObjectId if they're strings
    const mongoose = require("mongoose");
    if (typeof userId === "string") {
      userId = new mongoose.Types.ObjectId(userId);
    }
    if (typeof courseMongoId === "string") {
      courseMongoId = new mongoose.Types.ObjectId(courseMongoId);
    }

    console.log("Converted userId:", userId, "Type:", typeof userId);
    console.log("Converted courseMongoId:", courseMongoId, "Type:", typeof courseMongoId);

    const alreadyEnrolled =
      await Enrollment.findOne({
        userId,
        courseMongoId,
      });

    console.log("Already enrolled:", !!alreadyEnrolled);

    if (alreadyEnrolled) {
      return res.status(400).json({
        message: "Already Enrolled",
      });
    }

    const enrollment =
      await Enrollment.create({
        userId,
        courseMongoId,
        courseId,
      });

    console.log("Enrollment Created:");
    console.log("  ID:", enrollment._id);
    console.log("  userId:", enrollment.userId);
    console.log("  courseMongoId:", enrollment.courseMongoId);
    console.log("  courseId:", enrollment.courseId);

   const user = await SignupSchema.findById(userId);

    console.log("User found:", user?.name);

    await Notification.create({
      userId,
      title: "Course Enrolled",
      message: "Course enrolled successfully.",
      type: "course",
      link: "/my-courses"
    });

    await Notification.create({
      title: "Course Enrolled",
      message: `${user?.name || "User"} enrolled in ${courseId}.`,
      type: "course",
      link: "/admin/enrollments"
    });

    console.log("Notifications created");

    res.json({
      success: true,
      message: "Course enrolled successfully",
      enrollment: enrollment
    });
  } catch (error) {
    console.log("ENROLL ERROR:", error.message);
    console.log("Error stack:", error.stack);

    res.status(500).json({
      message: error.message,
      error: error.toString()
    });
  }
});

// USER: Check if user is enrolled in a course
app.get("/check-enrollment/:userId/:courseMongoId", async (req, res) => {
  try {
    const { userId, courseMongoId } = req.params;

    console.log("Checking enrollment for userId:", userId, "courseMongoId:", courseMongoId);

    const enrollment = await Enrollment.findOne({
      userId,
      courseMongoId,
    });

    console.log("Enrollment found:", enrollment);

    res.json({
      isEnrolled: !!enrollment,
      enrollment: enrollment || null,
    });
  } catch (error) {
    console.log("CHECK ENROLLMENT ERROR =>", error);
    res.status(500).json({
      message: error.message,
    });
  }
});


// USER: Get all enrolled courses for user
app.get("/my-courses/:userId", async (req, res) => {
  try {
    let { userId } = req.params;

    console.log("=== MY COURSES REQUEST ===");
    console.log("Raw userId:", userId, "Type:", typeof userId);

    // Validate userId
    if (!userId || userId === "null" || userId === "undefined") {
      return res.status(400).json({
        message: "Invalid userId",
        userId: userId
      });
    }

    // Convert to ObjectId if it's a string
    const mongoose = require("mongoose");
    if (typeof userId === "string") {
      userId = new mongoose.Types.ObjectId(userId);
    }

    console.log("Converted userId:", userId);

    const enrollments = await Enrollment.find({ userId });

    console.log("Enrollments found:", enrollments.length);
    if (enrollments.length > 0) {
      console.log("Enrollment details:");
      enrollments.forEach((e, idx) => {
        console.log(`  [${idx}]`, {
          id: e._id,
          userId: e.userId,
          courseMongoId: e.courseMongoId,
          courseId: e.courseId
        });
      });
    }

    if (enrollments.length === 0) {
      console.log("No enrollments found for user");
      return res.json([]);
    }

    const courseMongoIds = enrollments.map(
      (e) => e.courseMongoId
    );

    console.log("CourseMongoIds to search:", courseMongoIds);

    const courses = await CourseDetail.find({
      _id: { $in: courseMongoIds },
    });

    console.log("Courses found:", courses.length);
    if (courses.length > 0) {
      courses.forEach((c, idx) => {
        console.log(`  [${idx}]`, {
          _id: c._id,
          title: c.title,
          courseId: c.courseId
        });
      });
    }

    res.json(courses);
  } catch (error) {
    console.log("MY-COURSES ERROR:", error.message);
    console.log("Error stack:", error.stack);
    res.status(500).json({
      message: "Error fetching courses",
      error: error.message
    });
  }
});

// ========== DASHBOARD APIs (User/Admin) ==========

// USER: Get user dashboard statistics
app.get("/user-dashboard/:userId", async (req, res) => {
  try {
    const token =
localStorage.getItem("token");
    const { userId } = req.params;

    const enrollments =
      await Enrollment.find({ userId });

    const totalCourses =
      enrollments.length;

    const completedLectures =
      enrollments.reduce(
        (sum, course) =>
          sum + course.completedLectures,
        0
      );

    const certificates =
      enrollments.filter(
        (course) =>
          course.certificateEarned
      ).length;

    res.json({
      totalCourses,
      completedLectures,
      certificates,
      progress: 0,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});
// ADMIN: Get all enrollments
app.get("/admin/enrollments", async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("userId", "name email")
      .populate("courseMongoId", "title");

    res.json(enrollments);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// ADMIN: Delete enrollment
app.delete("/enrollments/:id", async (req, res) => {
  try {
    console.log("Delete ID:", req.params.id);

    const enrollment = await Enrollment.findByIdAndDelete(req.params.id);

    console.log("Deleted:", enrollment);

    if (!enrollment) {
      return res.status(404).json({
        message: "Enrollment not found",
      });
    }

    res.json({
      success: true,
      message: "Enrollment deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ========== NOTIFICATION APIs (User/Admin) ==========

// ADMIN: Get all notifications
app.get("/admin/notifications", async (req, res) => {
  const notifications = await Notification.find()
    .sort({ createdAt: -1 });

  res.json(notifications);
});

// ADMIN: Get unread notification count
app.get("/admin/notification-count", async (req, res) => {
  const count = await Notification.countDocuments({
    isRead: false,
  });

  res.json({ count });
});

// ADMIN: Mark all notifications as read
app.put("/admin/notifications/read-all", async (req, res) => {
  await Notification.updateMany(
    { isRead: false },
    { $set: { isRead: true } }
  );

  res.json({
    message: "All notifications marked as read",
  });
});

// USER: Get unread notification count for user
app.get( "/notifications/count/:userId",
  async (req, res) => {

    const count =
      await Notification.countDocuments({
        userId:
          req.params.userId,
        isRead: false,
      }) ;

    res.json({
      count,
    });
  }
);

// USER: Mark all user notifications as read
app.put("/notifications/read-all/:userId",
  async (req, res) => {

    await Notification.updateMany(
      {
        userId:
          req.params.userId,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );

    res.json({
      message:
        "All notifications marked as read",
    });
  }
);
// USER: Get all notifications for user
app.get("/notifications/:userId", async (req, res) => {
  console.log("Notification API Hit");
  console.log(req.params.userId);

  try {
    const notifications = await Notification.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    console.log(notifications);

    res.json(notifications);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
});

// USER: Mark single notification as read
app.put("/notifications/read/:id", async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(
      req.params.id,
      {
        isRead: true,
      }
    );

    res.json({
      message: "Notification Updated",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
// USER/ADMIN: Clear notifications
app.delete( "/notifications/clear",
  async (req, res) => {
    try {

      const {
        userId,
        role
      } = req.body;

      // Admin
      if (role === "admin") {

        await Notification.deleteMany({});

      }

      // User
      else {

        await Notification.deleteMany({
          userId: userId
        });

      }

      res.status(200).json({
        message: "success"
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "failed"
      });
    }
  }
);


// ========== PAYMENT APIs (User/Admin) ==========

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// USER/ADMIN: Create payment order
app.post("/create-order", async (req, res) => {
  try {
    const amount = Number(req.body.amount);

    if (!amount) {
      return res.status(400).json({
        message: "Invalid amount",
      });
    }

    const options = {
      amount: amount * 100, // paise me convert
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json(order);
  } catch (error) {
    console.log("ORDER ERROR:", error);
    res.status(500).json({
      message: error.message,
    });
  }
});


const rawPort = process.env.PORT;
const port = Number.isInteger(Number(rawPort))
  ? Number(rawPort)
  : 2000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
