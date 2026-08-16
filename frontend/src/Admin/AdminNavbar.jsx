import React, { useState, useEffect, useCallback } from "react";
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
  FaArrowLeft,
} from "react-icons/fa";

import {
  ToastContainer,
  toast,
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "./AdminNavbar.css";

function AdminNavbar() {

  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [notificationCount, setNotificationCount] =
    useState(0);

  const [adminName, setAdminName] = useState(
    sessionStorage.getItem("name") || "Admin"
  );

  const [adminEmail, setAdminEmail] = useState(
    sessionStorage.getItem("email") || "admin@gmail.com"
  );

  const [profileImage, setProfileImage] = useState(
    sessionStorage.getItem("profileImage") || ""
  );

  const userId = sessionStorage.getItem("userId");

  const API_URL =
    "https://nextgenprogrammers.onrender.com";


  /* =====================================================
     PROFILE IMAGE URL
  ===================================================== */

  const getImageUrl = (image) => {

    if (!image) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        adminName
      )}&background=021049&color=ffffff`;
    }

    // Already complete URL
    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    // Relative URL like /uploads/profile.jpg
    if (image.startsWith("/")) {
      return `${API_URL}${image}`;
    }

    // Relative URL like uploads/profile.jpg
    return `${API_URL}/${image}`;
  };


  /* =====================================================
     FETCH ADMIN PROFILE
  ===================================================== */

  const fetchProfile = useCallback(async () => {

    if (!userId) {
      console.log("User ID not found");
      return;
    }

    try {

      const res = await axios.get(
        `${API_URL}/UserProfile/${userId}`
      );

      console.log("ADMIN PROFILE:", res.data);

      const name =
        res.data.name || "Admin";

      const email =
        res.data.email || "admin@gmail.com";

      const image =
        res.data.profileImage || "";

      setAdminName(name);
      setAdminEmail(email);
      setProfileImage(image);

      // Update sessionStorage
      sessionStorage.setItem("name", name);
      sessionStorage.setItem("email", email);
      sessionStorage.setItem(
        "profileImage",
        image
      );

    } catch (error) {

      console.log(
        "Profile fetch error:",
        error
      );

    }

  }, [userId]);


  /* =====================================================
     LOAD PROFILE
  ===================================================== */

  useEffect(() => {

    fetchProfile();

  }, [fetchProfile]);


  /* =====================================================
     LISTEN FOR PROFILE UPDATE
  ===================================================== */

  useEffect(() => {

    const handleProfileUpdate = () => {

      const name =
        sessionStorage.getItem("name") ||
        "Admin";

      const email =
        sessionStorage.getItem("email") ||
        "admin@gmail.com";

      const image =
        sessionStorage.getItem("profileImage") ||
        "";

      setAdminName(name);
      setAdminEmail(email);
      setProfileImage(image);

      // API se latest profile bhi lao
      fetchProfile();
    };

    window.addEventListener(
      "profileUpdated",
      handleProfileUpdate
    );

    return () => {
      window.removeEventListener(
        "profileUpdated",
        handleProfileUpdate
      );
    };

  }, [fetchProfile]);


  /* =====================================================
     NOTIFICATION COUNT
  ===================================================== */

  const fetchNotificationCount =
    async () => {

      try {

        const res =
          await axios.get(
            `${API_URL}/admin/notification-count`
          );

        setNotificationCount(
          res.data.count || 0
        );

      } catch (error) {

        console.log(
          "Notification count error:",
          error
        );

      }

    };


  /* =====================================================
     NOTIFICATION POPUP
  ===================================================== */

  const fetchNotificationPopup =
    async () => {

      try {

        const res =
          await axios.get(
            `${API_URL}/admin/notifications`
          );

        const unread =
          res.data.filter(
            (item) => !item.isRead
          );

        unread.forEach((item) => {

          const alreadyShown =
            sessionStorage.getItem(
              `toast_${item._id}`
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
              `toast_${item._id}`,
              "shown"
            );
          }

        });

      } catch (error) {

        console.log(
          "Notification popup error:",
          error
        );

      }

    };


  /* =====================================================
     NOTIFICATION INTERVAL
  ===================================================== */

  useEffect(() => {

    fetchNotificationCount();
    fetchNotificationPopup();

    const interval =
      setInterval(() => {

        fetchNotificationCount();
        fetchNotificationPopup();

      }, 5000);

    return () => {
      clearInterval(interval);
    };

  }, []);


  /* =====================================================
     OPEN NOTIFICATIONS
  ===================================================== */

  const openNotifications =
    async () => {

      try {

        await axios.put(
          `${API_URL}/admin/notifications/read-all`
        );

        setNotificationCount(0);

        navigate(
          "/admin/notifications"
        );

      } catch (error) {

        console.log(error);

      }

    };


  /* =====================================================
     LOGOUT
  ===================================================== */

  const logout = () => {

    const confirmLogout =
      window.confirm(
        "Are you sure you want to logout?"
      );

    if (!confirmLogout) {
      return;
    }

    sessionStorage.clear();
    localStorage.clear();

    navigate("/", {
      replace: true,
    });

  };


  /* =====================================================
     PROFILE IMAGE ERROR
  ===================================================== */

  const handleImageError = (e) => {

    e.target.src =
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        adminName
      )}&background=021049&color=ffffff`;

  };


  return (
    <>

      {/* =================================================
          TOP NAVBAR
      ================================================= */}

      <div className="admin-top-navbar">

        {/* LEFT */}

        <div className="admin-navbar-left">

          <button
            className="back-btn"
            onClick={() => navigate(-1)}
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


        {/* RIGHT */}

        <div className="admin-navbar-right">

          {/* Notification */}

          <div
            className="admin-notification"
            onClick={openNotifications}
          >

            <FaBell />

            {notificationCount > 0 && (
              <span>
                {notificationCount}
              </span>
            )}

          </div>


          {/* Profile */}

          <div
            className="admin-profile"
            onClick={() =>
              navigate("/Admin/Profile")
            }
          >

            <img
              src={getImageUrl(profileImage)}
              alt="Admin Profile"
              className="navbar-profile"
              onError={handleImageError}
            />

            <div className="admin-tooltip">

              <h4>
                {adminName}
              </h4>

              <p>
                {adminEmail}
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          SIDEBAR
      ================================================= */}

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
            <span>
              Dashboard
            </span>
          </Link>


          <Link
            to="/Courses"
            className="admin-nav-link"
          >
            <FaBookOpen />
            <span>
              Courses
            </span>
          </Link>


          <Link
            to="/Admin/Students"
            className="admin-nav-link"
          >
            <FaUsers />
            <span>
              Students
            </span>
          </Link>


          <Link
            to="/Admin/AdminEnrollment"
            className="admin-nav-link"
          >
            <FaClipboardList />
            <span>
              Enrollments
            </span>
          </Link>


          <Link
            to="/Admin/Messages"
            className="admin-nav-link"
          >
            <FaEnvelope />
            <span>
              Messages
            </span>
          </Link>


          <Link
            to="/Admin/Profile"
            className="admin-nav-link"
          >
            <FaUserCircle />
            <span>
              Profile
            </span>
          </Link>

        </div>


        {/* LOGOUT */}

        <div className="admin-logout-section">

          <button
            className="admin-logout-btn"
            onClick={logout}
          >

            <FaSignOutAlt />

            <span>
              Logout
            </span>

          </button>

        </div>

      </div>


      {/* TOAST */}

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