import React, { useEffect, useState, useRef } from "react";
import {
  FaBookOpen,
  FaCertificate,
  FaPlayCircle,
  FaArrowRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./Dashboard.css";
import UserNavbar from "./UserNavbar";

function Dashboard() {
const backCount = useRef(0);
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const [dashboardData, setDashboardData] =
    useState({
      totalCourses: 0,
      completedLectures: 0,
      certificates: 0,
      progress: 0,
    });

  const [recommendedCourses, setRecommendedCourses] =
    useState([]);


useEffect(() => {
   const role = sessionStorage.getItem("role"); 
   if (role !== "user") { 
    navigate("/Login", { replace: true });
     return; 
    } 
    fetchDashboardData(); 
    fetchCourses();
   }, [navigate]);

useEffect(() => {
  window.history.pushState(
    { dashboard: true },
    "",
    window.location.href
  );

  const handleBack = () => {

    if (backCount.current === 0) {

      backCount.current = 1;

      window.history.pushState(
        { dashboard: true },
        "",
        window.location.href
      );

      return;
    }

    sessionStorage.clear();

    navigate("/", {
      replace: true,
    });
  };

  window.addEventListener(
    "popstate",
    handleBack
  );

  return () => {
    window.removeEventListener(
      "popstate",
      handleBack
    );
  };
}, [navigate]);


const fetchDashboardData = async () => {
  try {
    const userId =
      sessionStorage.getItem("userId");

    const coursesRes = await axios.get(
      `https://nextgenprogrammers.onrender.com/my-courses/${userId}`
    );

    let dashboardRes = {
      data: {
        completedLectures: 0,
        certificates: 0,
        progress: 0,
      },
    };

    try {
      dashboardRes = await axios.get(`https://nextgenprogrammers.onrender.com/user-dashboard/${userId}`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
    } catch (err) {
      console.log(
        "Dashboard API not found"
      );
    }

    setDashboardData({
      totalCourses:
        coursesRes.data?.length || 0,

      completedLectures:
        dashboardRes.data
          ?.completedLectures || 0,

      certificates:
        dashboardRes.data
          ?.certificates || 0,

      progress:
        dashboardRes.data?.progress ||
        0,
    });
  } catch (error) {
    console.log(error);
  }
};

const fetchCourses = async () => {
  try {
    const res = await axios.get(
      "https://nextgenprogrammers.onrender.com/Courses"
    );

    setRecommendedCourses(
      res.data.slice(0, 3)
    );
  } catch (error) {
    console.log(error);
  }
};



  return (
    <div className="app-layout">
      <UserNavbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div
        className={`user-dashboard-page ${
          !sidebarOpen ? "expanded" : ""
        }`}
      >
        {/* HERO */}

        <section className="dashboard-hero">
          <div className="hero-left">
            <h1>
              Welcome Back,{" "}
              {sessionStorage.getItem("name")} 👋
            </h1>

            <p>
              Continue your learning journey and
              achieve your career goals with
              NextGen Programmers.
            </p>

            <button
              className="hero-btn"
              onClick={() =>
                navigate("/mycourses")
              }
            >
              Continue Learning
            </button>
          </div>

          
        </section>

        {/* STATS */}

        <section className="stats-grid">
          <div className="stat-card" onClick={() => navigate("/mycourses")}>
            <div className="stat-icon">
              <FaBookOpen />
            </div>

            <h2>
              {dashboardData.totalCourses}
            </h2>

            <p>Enrolled Courses</p>
          </div>

          <div className="stat-card" >
            <div className="stat-icon">
              <FaPlayCircle />
            </div>

            <h2>
              {
                dashboardData.completedLectures
              }
            </h2>

            <p>Completed Lectures</p>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaCertificate />
            </div>

            <h2>
              {dashboardData.certificates}
            </h2>

            <p>Certificates</p>
          </div>
        </section>

        {/* ACCOUNT + SUMMARY */}

        <section className="dashboard-grid">
          <div className="dashboard-card dashboard1" onClick={() => navigate("/user/profile")}>
            <h3>Account Details</h3>

            <div className="class-item">
              <strong>Name</strong>

              <p>
                {sessionStorage.getItem(
                  "name"
                )}
              </p>
            </div>

            <div className="class-item">
              <strong>Email</strong>

              <p>
                {sessionStorage.getItem(
                  "email"
                )}
              </p>
            </div>
          </div>

          <div className="dashboard-card">
            <h3>Learning Summary</h3>

            <div className="class-item">
              <strong>
                Total Courses Enrolled
              </strong>

              <p>
                {
                  dashboardData.totalCourses
                }
              </p>
            </div>

            <div className="class-item">
              <strong>
                Certificates Earned
              </strong>

              <p>
                {
                  dashboardData.certificates
                }
              </p>
            </div>

            <div className="class-item">
              <strong>
                Total Lectures Completed
              </strong>

              <p>
                {
                  dashboardData.completedLectures
                }
              </p>
            </div>
          </div>
        </section>

        {/* RECOMMENDED COURSES */}

        <section className="recommended-section">
          <div className="section-header">
            <h2>
              Recommended Courses
            </h2>

            <button
              onClick={() =>
                navigate("/courses")
              }
            >
              View All
              <FaArrowRight />
            </button>
          </div>

          <div className="recommended-grid">
            {recommendedCourses.map(
              (course) => (
                <div
                  className="recommended-card"
                  key={course._id}
                >
                  <img
                    src={course.image}
                    alt={course.title}
                  />

                  <div className="recommended-content">
                    <h3>
                      {course.title}
                    </h3>

                    <p>
                      {
                        course.description
                      }
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;