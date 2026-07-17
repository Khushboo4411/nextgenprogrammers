import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaTachometerAlt,
  FaBookOpen,
  FaUsers,
  FaClipboardList,
  
  FaEnvelope,
  FaUserCircle,
  FaSignOutAlt,
 
  FaBell,
  FaArrowLeft
} from "react-icons/fa";
import {
  ToastContainer,
  toast,
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import "./AdminNavbar.css";

function AdminNavbar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationCount, setNotificationCount] =
    useState(0);

  useEffect(() => {
    fetchNotificationCount();
  }, []);

  const navigate = useNavigate();

  const adminName =
    sessionStorage.getItem("name") || "Admin";

  const adminEmail =
    sessionStorage.getItem("email") ||
    "admin@gmail.com";

  const profileImage =
    sessionStorage.getItem("profileImage");

  // ==========================
  // Admin Protection
  // ==========================

  
 

const logout = () => {

  console.log("Logout clicked");

  const confirmLogout =
    window.confirm(
      "Are you sure you want to logout?"
    );

  console.log(confirmLogout);

  if (!confirmLogout)
    return;

  localStorage.removeItem(
    "token"
  );

  sessionStorage.clear();
  localStorage.clear();

  navigate("/", {
    replace: true,
  });

  // window.location.reload();
};

const fetchNotificationCount = async () => {
  const res = await axios.get(
    "https://nextgenprogrammers.onrender.com/admin/notification-count"
  );

  setNotificationCount(res.data.count);
};

useEffect(() => {

  fetchNotificationCount();
  fetchNotificationPopup();

  const interval =
    setInterval(() => {

      fetchNotificationCount();
      fetchNotificationPopup();

    }, 5000);

  return () =>
    clearInterval(
      interval
    );

}, []);


const fetchNotificationPopup =
  async () => {
    try {
      const res =
        await axios.get(
          "https://nextgenprogrammers.onrender.com/admin/notifications"
        );

      const unread =
        res.data.filter(
          (item) =>
            !item.isRead
        );

      unread.forEach(
        (item) => {
          const alreadyShown =
            sessionStorage.getItem(
              `toast_${item._id}`
            );

          if (
            !alreadyShown
          ) {
            toast.info(
              `${item.title}\n${item.message}`,
              {
                position:
                  "top-right",
                autoClose: 4000,
              }
            );

            sessionStorage.setItem(
              `toast_${item._id}`,
              "shown"
            );
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  };



const openNotifications = async () => {
  try {

    await axios.put(
      "https://nextgenprogrammers.onrender.com/admin/notifications/read-all"
    );

    // badge ko turant 0 dikhao
    setNotificationCount(0);

    navigate("/admin/notifications");

  } catch (error) {
    console.log(error);
  }
};


  return (
    <>
      {/* Top Navbar */}

      <div className="admin-top-navbar">
        <div className="admin-navbar-left">
          <button
                      className="back-btn"
                      onClick={() =>
                        navigate(-1)
                      }
                    >
                      <FaArrowLeft />
                    </button>
          <div
            className="admin-menu-icon"
            
            onClick={() =>
              setSidebarOpen(!sidebarOpen)
            }
          >
            ☰
          </div>

          <h2 className="admin-brand">
            🎓 NextGen Admin
          </h2>
        </div>

        
        {/* Right Side */}

        <div className="admin-navbar-right ">
       <div
  className="admin-notification"
  onClick={openNotifications}
>
  <FaBell />

  {notificationCount > 0 && (
    <span>{notificationCount}</span>
  )}
</div>

<div
  className="admin-profile"
  onClick={() => navigate("/Admin/Profile")}
>
  <img
    src={
      sessionStorage.getItem("profileImage") ||
      `https://ui-avatars.com/api/?name=${
        sessionStorage.getItem("name")
      }`
    }
    alt="profile"
    className="navbar-profile"
  />

  <span className="admin-tooltip">
    {sessionStorage.getItem("name")}
  </span>
</div>
        </div>
      </div>

      {/* Sidebar */}

      <div
        className={
          sidebarOpen
            ? "admin-sidebar"
            : "admin-sidebar admin-collapsed"
        }
      >
        <div className="admin-sidebar-menu">

          <Link
            to="/Admin/Dashboard"
            className="admin-nav-link"
          >
            <FaTachometerAlt />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/Courses"
            className="admin-nav-link"
          >
            <FaBookOpen />
            <span>Courses</span>
          </Link>

          <Link
            to="/Admin/Students"
            className="admin-nav-link"
          >
            <FaUsers />
            <span>Students</span>
          </Link>

          <Link
            to="/Admin/AdminEnrollment"
            className="admin-nav-link"
          >
            <FaClipboardList />
            <span>Enrollments</span>
          </Link>

         

          <Link
            to="/Admin/Messages"
            className="admin-nav-link"
          >
            <FaEnvelope />
            <span>Messages</span>
          </Link>

          <Link
            to="/Admin/Profile"
            className="admin-nav-link"
          >
            <FaUserCircle />
            <span>Profile</span>
          </Link>
        </div>

        {/* Logout */}

        <div className="admin-logout-section">
          <button
            className="admin-logout-btn"
            onClick={logout}
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>
      <ToastContainer
  position="top-right"
  autoClose={4000}
  newestOnTop
  closeOnClick
  pauseOnHover
/>
    </>
    
  );
  
}

export default AdminNavbar;