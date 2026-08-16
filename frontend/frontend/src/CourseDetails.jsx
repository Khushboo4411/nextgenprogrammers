import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./CourseDetails.css";
import Navbar from "./Navbar";
import ScrollToTop from "./ScrollToTop";
import { FaStar, FaClock, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function CourseDetails() {
   const role = sessionStorage.getItem("role");

  const navigate = useNavigate();



  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetch(`https://nextgenprogrammers.onrender.com/CourseDetails/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Course Data:", data);
        console.log("Course _id:", data._id);
        console.log("Course courseId:", data.courseId);
        setCourse(data);
        
        // Check if user is already enrolled
        const userId = sessionStorage.getItem("userId");
        if (userId && data._id) {
          console.log("Checking enrollment with userId:", userId, "courseMongoId:", data._id);
          checkEnrollment(userId, data._id);
        }
        
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [id]);

  const checkEnrollment = async (userId, courseMongoId) => {
    try {
      const response = await axios.get(
        `https://nextgenprogrammers.onrender.com/check-enrollment/${userId}/${courseMongoId}`
      );
      setIsEnrolled(response.data.isEnrolled);
    } catch (error) {
      console.log("Error checking enrollment:", error);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="details-page">
          <h2 className="status-text">Loading...</h2>
        </div>
      </>
    );
  }

  if (!course) {
    return (
      <>
        <Navbar />
        <div className="details-page">
          <h2 className="status-text">Course Not Found</h2>
        </div>
      </>
    );
  }


  const handleEnroll = async () => {
  const role = sessionStorage.getItem("role");

  if (!role) {
    navigate("/Login");
    return;
  }

  if (role === "admin") {
    alert("Admin cannot purchase courses");
    return;
  }

  if (isEnrolled) {
    alert("You are already enrolled in this course!");
    return;
  }

  setEnrolling(true);

  try {
    const userId =
      sessionStorage.getItem("userId");

    const amount = Number(
      course.price.replace(/[₹,]/g, "")
    );

    // Create Razorpay Order
    const order = await axios.post(
      "https://nextgenprogrammers.onrender.com/create-order",
      {
        amount,
      }
    );

    const options = {
key: "rzp_test_T6hS2puWulmIzq",    
  amount: order.data.amount,

      currency: order.data.currency,

      order_id: order.data.id,

      name: "NextGen Programmers",

      description: course.title,

      prefill: {
        name:
          sessionStorage.getItem("name"),

        email:
          sessionStorage.getItem("email"),
      },

      handler: async function (
        response
      ) {
        try {
          const enrollPayload = {
            userId,
            courseMongoId: course._id,
            courseId: course.courseId,
          };

          console.log("=== ENROLLMENT PAYLOAD ===");
          console.log("userId:", userId);
          console.log("course._id:", course._id);
          console.log("course.courseId:", course.courseId);
          console.log("Full payload:", enrollPayload);

          const enrollResponse = await axios.post(
            "https://nextgenprogrammers.onrender.com/EnrollCourse",
            enrollPayload
          );

          console.log("Enrollment response:", enrollResponse.data);

          setIsEnrolled(true);
          alert(
            "Payment Successful & Course Enrolled"
          );
          console.log("ORDER:", order.data);

          // Add a small delay before navigation to ensure database is updated
          setTimeout(() => {
            navigate("/mycourses");
          }, 500);
        } catch (error) {
          console.log("Enrollment error:", error);
          console.log("Error response:", error.response?.data);

          alert(
            "Enrollment Failed: " + (error.response?.data?.message || error.message)
          );
        } finally {
          setEnrolling(false);
        }
      },

      theme: {
        color: "#021049",
      },
    };

    const payment =
      new window.Razorpay(
        options
      );

    payment.open();
  } catch (error) {
    console.log(error);

    alert("Payment Failed");
    setEnrolling(false);
  }
};


  return (
    <>
{
  role ? null : <Navbar />
}      <ScrollToTop />

      <div className="details-page">
        {/* Hero Section */}
        <div className="hero">
          <div className="hero-content">
            <span className="tag">
              {course.tag || "Best Seller"}
            </span>

            <h1>{course.title}</h1>

            <p>{course.description}</p>

            <div className="stats">
              <span>
                <FaStar />
                {course.rating}
              </span>

              <span>
                <FaClock />
                {course.duration}
              </span>
            </div>
          </div>

          <div className="hero-image">
            <img
              src={course.image}
              alt={course.title}
            />
          </div>
        </div>

        {/* Content Section */}
<div className="details-grid">
          <div className="left">

            <div className="card">
              <h2>What You'll Learn</h2>

              {course.skills?.map((skill, index) => (
                <p key={index}>
                  <FaCheckCircle /> {skill}
                </p>
              ))}
            </div>

            

            {/* Projects */}
            <div className="card">
              <h2>Projects You'll Build</h2>

              {course.projects && course.projects.length > 0 ? (
                course.projects.map((project, index) => (
                  <p key={index}>
                    <FaCheckCircle />
                    {project}
                  </p>
                ))
              ) : (
                <p>No projects available.</p>
              )}
            </div>

            {/* Curriculum */}
            <div className="card">
              <h2>Course Curriculum</h2>

              {course.curriculum &&
              course.curriculum.length > 0 ? (
                <ul>
                  {course.curriculum.map(
                    (module, index) => (
                      <li key={index}>{module}</li>
                    )
                  )}
                </ul>
              ) : (
                <ul>
                  <li>Module 1 - Introduction</li>
                  <li>Module 2 - Fundamentals</li>
                  <li>Module 3 - Intermediate Concepts</li>
                  <li>Module 4 - Advanced Topics</li>
                  <li>Module 5 - Final Project</li>
                </ul>
              )}
            </div>

            {/* Requirements */}
            <div className="card">
              <h2>Requirements</h2>

              <ul>
                <li>Basic Computer Knowledge</li>
                <li>Internet Connection</li>
                <li>Passion to Learn</li>
              </ul>
            </div>

          </div>

          {/* Right Side */}
          <div className="right">
            <div className="price-card">

              <h2>{course.price}</h2>

              <button
                className="enroll-btn"
                onClick={handleEnroll}
                disabled={isEnrolled || enrolling}
              >
                {isEnrolled 
                  ? "Already Enrolled" 
                  : enrolling 
                  ? "Processing..." 
                  : "Enroll Now"}
              </button>

              <div className="features">
                <p>✔ Live Interactive Classes</p>
                <p>✔ Recorded Sessions</p>
                <p>✔ Notes & Assignments</p>
                <p>✔ Certificate of Completion</p>
                <p>✔ Placement Assistance</p>
                <p>✔ Resume Building</p>
                <p>✔ Mock Interviews</p>
                <p>✔ Lifetime Access</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CourseDetails;