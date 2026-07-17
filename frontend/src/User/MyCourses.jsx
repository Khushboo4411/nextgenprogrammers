import React, { useEffect, useState } from "react";
import axios from "axios";
import UserNavbar from "./UserNavbar";
import "./MyCourses.css";

function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const userId = sessionStorage.getItem("userId");

      const res = await axios.get(
        `https://nextgenprogrammers.onrender.com/my-courses/${userId}`
      );

      setCourses(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <div className="app-layout">
      <UserNavbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div
        className={`mycourses-page ${
          !sidebarOpen ? "expanded" : ""
        }`}
      >
        <div className="mycourses-header">
          <h1>My Courses</h1>
        </div>

        {loading ? (
          <h2>Loading...</h2>
        ) : courses.length === 0 ? (
          <h2>No Courses Enrolled Yet</h2>
        ) : (
          <div className="course-container">
            {courses.map((course) => (
              <div className="course-card" key={course._id}>
                <img
                  src={course.image}
                  alt={course.title}
                  className="course-card-image"
                />

                <div className="course-card-content">
  <h3>{course.title}</h3>

  <p>{course.description}</p>

  <button
  className="course-btn"
  onClick={() => {
    if (course.youtubeLink) {
      window.open(
        course.youtubeLink,
        "_blank"
      );
    } else {
      alert(
        "Course video not available"
      );
    }
  }}
>
  Start Learning
</button>
</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyCourses;