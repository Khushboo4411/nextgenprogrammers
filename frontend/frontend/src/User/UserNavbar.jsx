import React, {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import axios from "axios";
import {
  ToastContainer,
  toast,
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import {
  FaTachometerAlt,
  FaBook,

  FaUserCircle,
  FaSignOutAlt,
  FaBookOpen,
  
  FaEnvelope,
  FaArrowLeft,
  FaBell,
} from "react-icons/fa";

import "./UserNavbar.css";

function UserNavbar({
  sidebarOpen = true,
  setSidebarOpen = () => {},
}) {

  const navigate = useNavigate();

  const [notificationCount,
    setNotificationCount] =
    useState(0);

  const userName =
    sessionStorage.getItem("name") ||
    "Student";

    const userEmail = sessionStorage.getItem("email") || "No Email";


  const profileImage =
    sessionStorage.getItem(
      "profileImage"
    );

  // ==========================
  // Notification Count
  // ==========================
  const fetchNotificationCount =
    async () => {
      try {

        const userId =
          sessionStorage.getItem(
            "userId"
          );

        if (!userId) return;

        const res =
          await axios.get(
            `https://nextgenprogrammers.onrender.com/notifications/count/${userId}`
          );

        setNotificationCount(
          res.data.count
        );

      } catch (error) {
        console.log(error);
      }
    };

    const fetchNotificationPopup = async () => {
  try {
    const userId =
      sessionStorage.getItem("userId");

    if (!userId) return;

    const res = await axios.get(
      `https://nextgenprogrammers.onrender.com/notifications/${userId}`
    );

    const unread =
      res.data.filter(
        (item) => !item.isRead
      );

    unread.forEach((item) => {
      const alreadyShown =
        sessionStorage.getItem(
          `user_toast_${item._id}`
        );

      if (!alreadyShown) {
        toast.info(
          `${item.title}\n${item.message}`,
          {
            position: "top-right",
            autoClose: 4000,
          }
        );

        sessionStorage.setItem(
          `user_toast_${item._id}`,
          "shown"
        );
      }
    });

  } catch (error) {
    console.log(error);
  }
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
    clearInterval(interval);

}, []);

  // ==========================
  // Open Notifications
  // ==========================
  const openNotifications =
    async () => {

      try {

        const userId =
          sessionStorage.getItem(
            "userId"
          );
await axios.put(
  `https://nextgenprogrammers.onrender.com/notifications/read-all/${userId}`
);

// instantly UI update
setNotificationCount(0);

// safety refresh (optional but good)
fetchNotificationCount();
        navigate(
          "/notifications"
        );

      } catch (error) {
        console.log(error);
      }
    };

  // ==========================
  // Logout
  // ==========================
  const handleLogout =
    () => {

      const confirmLogout =
        window.confirm(
          "Are you sure you want to logout?"
        );

      if (!confirmLogout)
        return;

      sessionStorage.clear();
      localStorage.clear();

      navigate("/");

    };


  return (
    <>
      {/* Sidebar */}

      <div
        className={
          sidebarOpen
            ? "user-sidebar"
            : "user-sidebar user-collapsed"
        }
      >
        <div>
          <div className="user-sidebar-menu">

            <Link
              to="/User/Dashboard"
              className="user-nav-link"
            >
              <FaTachometerAlt />
              <span>
                Dashboard
              </span>
            </Link>

            <Link
              to="/User/Courses"
              className="user-nav-link"
            >
              <FaBookOpen />
              <span>
                Browse Courses
              </span>
            </Link>

            <Link
              to="/mycourses"
              className="user-nav-link"
            >
              <FaBook />
              <span>
                My Courses
              </span>
            </Link>

            <Link
              to="/Help"
              className="user-nav-link"
            >
              <FaEnvelope />
              <span>
                Help
              </span>
            </Link>

            <Link
              to="/user/profile"
              className="user-nav-link"
            >
              <FaUserCircle />
              <span>
                Profile
              </span>
            </Link>

          </div>
        </div>

        {/* Logout */}

        <div className="user-logout-section">
          <button
            className="user-logout-btn"
            onClick={
              handleLogout
            }
          >
            <FaSignOutAlt />
            <span>
              Logout
            </span>
          </button>
        </div>
      </div>

      {/* Top Navbar */}

      <div className="user-top-navbar">

        <div className="user-navbar-left">

          <button
            className="back-btn"
            onClick={() =>
              navigate(-1)
            }
          >
            <FaArrowLeft />
          </button>

          <div
            className="user-menu-icon"
            onClick={() =>
              setSidebarOpen(
                !sidebarOpen
              )
            }
          >
            ☰
          </div>

          <h2 className="user-brand">
            🎓 NextGen Programmer
          </h2>

        </div>

      

        {/* Right */}

        <div className="user-dashboard-right">

         <div
  className="user-notification"
  onClick={
    openNotifications
  }
>
  <FaBell className="notification-icon " />

  {notificationCount > 0 && (
    <span>
      {notificationCount}
    </span>
  )}
</div>

        <div
  className="user-profile"
  onClick={() => navigate("/user/profile")}
>
  <img
    src={
      profileImage
        ? profileImage
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
            userName
          )}&background=021049&color=ffffff`
    }
    alt="profile"
  />

  <div className="user-profile-tooltip">
    <h4>{userName}</h4>
    <p>{userEmail}</p>
  </div>
</div>

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

export default UserNavbar;