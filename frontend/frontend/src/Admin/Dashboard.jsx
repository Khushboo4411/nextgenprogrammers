import "./Dashboard.css";
import AdminNavbar from "./AdminNavbar";
import { useNavigate } from "react-router-dom";
import { useEffect , useState} from "react";
import { useRef  } from "react";
import axios from "axios";

import {
  FaBookOpen,
  FaVideo,
  FaClipboardList,
  FaAward,

} from "react-icons/fa";

function Dashboard() {
  const navigate = useNavigate();
  const backCount = useRef(0);
  const [recentActivities, setRecentActivities] =
  useState([]);

  const fetchRecentActivities = async () => {
  try {
    const res = await axios.get(
      "https://nextgenprogrammers.onrender.com/admin/notifications"
    );

    setRecentActivities(
      res.data.slice(0, 5)
    ); // latest 5 notifications
  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  fetchRecentActivities();
}, []);
  
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

  return (
    <>
      <AdminNavbar />

      <div className="admin-dashboard-content">

        {/* Welcome Section */}
        <div className="admin-welcome-card">
          <div>
            <h1>Welcome Back 👋</h1>
            <p>
              Manage your coaching institute,
              courses, lectures and students
              from one place.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="admin-section-title">
          Quick Actions
        </div>

        <div className="admin-action-grid">
          <div className="admin-action-card" onClick={() => navigate("/admin/course-form")}>
            <FaBookOpen />
            <h3>Add Course</h3>
            <p>Create new courses</p>
          </div>

          <div className="admin-action-card">
            <FaVideo />
            <h3>Upload Lecture</h3>
            <p>Add video lectures</p>
          </div>

          <div className="admin-action-card">
            <FaClipboardList />
            <h3>Assignment</h3>
            <p>Create assignments</p>
          </div>

          <div className="admin-action-card">
            <FaAward />
            <h3>Certificate</h3>
            <p>Issue certificates</p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="admin-dashboard-grid">

        <div className="admin-card">
  <div className="admin-card-header">
    <FaBookOpen />
    <h3>Popular Classes</h3>
  </div>

  <ul className="popular-class-list">

    <li
      onClick={() =>
        navigate("/course/mern-stack")
      }
    >
      MERN Stack Development
    </li>

    <li
      onClick={() =>
        navigate("/course/java-full-stack-development")
      }
    >
      Java Full Stack
    </li>

    <li
      onClick={() =>
        navigate("/course/dsa-cpp")
      }
    >
      DSA with C++
    </li>

    <li
      onClick={() =>
        navigate("/course/machine-learning-python")
      }
    >
      Machine Learning with Python
    </li>

    <li
      onClick={() =>
        navigate("/course/android-development")
      }
    >
      Android App Development
    </li>

  </ul>
</div>

          

  <div className="recent-activity-list">
     <div className="admin-card-header">
    <FaClipboardList />
    <h3>Recent Activity</h3>
  </div>
    {recentActivities.length === 0 ? (
      <p>No Recent Activity</p>
    ) : (
      
      recentActivities.map((item) => (
        <div
          className="activity-item"
          key={item._id}
        >
          <h4>{item.title}</h4>

          <p>{item.message}</p>

          <small>
            {new Date(
              item.createdAt
            ).toLocaleString()}
          </small>
        </div>
      ))
    )}
        </div>
      </div>
        </div>

    </>
  );
}

export default Dashboard;