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

  // ==========================
  // USER STATES
  // ==========================

  const [userName, setUserName] = useState(
    sessionStorage.getItem("name") || "Student"
  );

  const [userEmail, setUserEmail] = useState(
    sessionStorage.getItem("email") || "No Email"
  );

  const [profileImage, setProfileImage] =
    useState(
      sessionStorage.getItem("profileImage") || ""
    );

  const [notificationCount, setNotificationCount] =
    useState(0);


  // ==========================
  // NOTIFICATION COUNT
  // ==========================

  const fetchNotificationCount = async () => {

    try {

      const userId =
        sessionStorage.getItem("userId");

      if (!userId) return;

      const res = await axios.get(
        `https://nextgenprogrammers.onrender.com/notifications/count/${userId}`
      );

      setNotificationCount(
        res.data.count || 0
      );

    } catch (error) {

      console.log(
        "Notification Count Error:",
        error
      );

    }

  };


  // ==========================
  // NOTIFICATION POPUP
  // ==========================

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

      console.log(
        "Notification Popup Error:",
        error
      );

    }

  };


  // ==========================
  // PROFILE UPDATE LISTENER
  // ==========================

  useEffect(() => {

    // Initial notification fetch
    fetchNotificationCount();
    fetchNotificationPopup();


    // Notification interval
    const interval =
      setInterval(() => {

        fetchNotificationCount();
        fetchNotificationPopup();

      }, 5000);


    // ==========================
    // PROFILE UPDATE EVENT
    // ==========================

    const handleProfileUpdate = () => {

      const updatedName =
        sessionStorage.getItem("name") ||
        "Student";

      const updatedEmail =
        sessionStorage.getItem("email") ||
        "No Email";

      const updatedImage =
        sessionStorage.getItem("profileImage") ||
        "";

      setUserName(updatedName);
      setUserEmail(updatedEmail);
      setProfileImage(updatedImage);

    };


    window.addEventListener(
      "profileUpdated",
      handleProfileUpdate
    );


    // Cleanup
    return () => {

      clearInterval(interval);

      window.removeEventListener(
        "profileUpdated",
        handleProfileUpdate
      );

    };

  }, []);


  // ==========================
  // OPEN NOTIFICATIONS
  // ==========================

  const openNotifications = async () => {

    try {

      const userId =
        sessionStorage.getItem("userId");

      if (!userId) return;

      await axios.put(
        `https://nextgenprogrammers.onrender.com/notifications/read-all/${userId}`
      );

      // Immediately remove notification badge
      setNotificationCount(0);

      // Safety refresh
      fetchNotificationCount();

      navigate("/notifications");

    } catch (error) {

      console.log(
        "Open Notification Error:",
        error
      );

    }

  };


  // ==========================
  // LOGOUT
  // ==========================

  const handleLogout = () => {

    const confirmLogout =
      window.confirm(
        "Are you sure you want to logout?"
      );

    if (!confirmLogout) return;

    sessionStorage.clear();
    localStorage.clear();

    navigate("/");

  };


  return (
    <>
      {/* =====================================
          SIDEBAR
      ====================================== */}

      <div
        className={
          sidebarOpen
            ? "user-sidebar"
            : "user-sidebar user-collapsed"
        }
      >

        <div>

          <div className="user-sidebar-menu">

            {/* Dashboard */}

            <Link
              to="/User/Dashboard"
              className="user-nav-link"
            >

              <FaTachometerAlt />

              <span>
                Dashboard
              </span>

            </Link>


            {/* Browse Courses */}

            <Link
              to="/User/Courses"
              className="user-nav-link"
            >

              <FaBookOpen />

              <span>
                Browse Courses
              </span>

            </Link>


            {/* My Courses */}

            <Link
              to="/mycourses"
              className="user-nav-link"
            >

              <FaBook />

              <span>
                My Courses
              </span>

            </Link>


            {/* Help */}

            <Link
              to="/Help"
              className="user-nav-link"
            >

              <FaEnvelope />

              <span>
                Help
              </span>

            </Link>


            {/* Profile */}

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


        {/* =====================================
            LOGOUT
        ====================================== */}

        <div className="user-logout-section">

          <button
            className="user-logout-btn"
            onClick={handleLogout}
          >

            <FaSignOutAlt />

            <span>
              Logout
            </span>

          </button>

        </div>

      </div>


      {/* =====================================
          TOP NAVBAR
      ====================================== */}

      <div className="user-top-navbar">

        {/* LEFT */}

        <div className="user-navbar-left">

          {/* Back */}

          <button
            className="back-btn"
            onClick={() =>
              navigate(-1)
            }
          >

            <FaArrowLeft />

          </button>


          {/* Menu */}

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


          {/* Brand */}

          <h2 className="user-brand">
            🎓 NextGen Programmer
          </h2>

        </div>


        {/* =====================================
            RIGHT SIDE
        ====================================== */}

        <div className="user-dashboard-right">


          {/* Notification */}

          <div
            className="user-notification"
            onClick={openNotifications}
          >

            <FaBell
              className="notification-icon"
            />

            {notificationCount > 0 && (

              <span>
                {notificationCount}
              </span>

            )}

          </div>


          {/* =====================================
              PROFILE
          ====================================== */}

          <div
            className="user-profile"
            onClick={() =>
              navigate("/user/profile")
            }
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


            {/* User name/email */}

            <div className="user-profile-tooltip">

              <h4>
                {userName}
              </h4>

              <p>
                {userEmail}
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================
          TOAST CONTAINER
      ====================================== */}

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