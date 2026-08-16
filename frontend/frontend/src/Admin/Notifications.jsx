import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";
import AdminNavbar from "./AdminNavbar";
import { useNavigate } from "react-router-dom";
import "./Notifications.css";


function Notifications() {
  const [notifications, setNotifications] =
    useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  // ==========================
  // Fetch Notifications
  // ==========================
  const fetchNotifications =
    async () => {
      try {
        const res =
          await axios.get(
            "https://nextgenprogrammers.onrender.com/admin/notifications"
          );

        setNotifications(
          res.data
        );
      } catch (error) {
        console.log(error);
      }
    };

  // ==========================
  // Mark Single Notification Read
  // ==========================
  const markNotificationRead =
    async (id) => {
      try {
        await axios.put(
          `https://nextgenprogrammers.onrender.com/admin/notifications/read/${id}`
        );
      } catch (error) {
        console.log(error);
      }
    };

  // ==========================
  // Mark All Read
  // ==========================
  const markAllRead =
    async () => {
      try {
        await axios.put(
          "https://nextgenprogrammers.onrender.com/admin/notifications/read-all"
        );

        fetchNotifications();

        // navbar count update
        window.dispatchEvent(
          new Event(
            "notificationUpdated"
          )
        );
      } catch (error) {
        console.log(error);
      }
    };

  // ==========================
  // Clear All Notifications
  // ==========================
  const clearAllNotifications =
    async () => {
      const confirmDelete =
        window.confirm(
          "Are you sure you want to clear all notifications?"
        );

      if (!confirmDelete)
        return;

      try {
        const userId =
          sessionStorage.getItem(
            "userId"
          );

        const role =
          sessionStorage.getItem(
            "role"
          );

        await axios.delete(
          "https://nextgenprogrammers.onrender.com/notifications/clear",
          {
            data: {
              userId,
              role,
            },
          }
        );

        setNotifications([]);

        // navbar count update
        window.dispatchEvent(
          new Event(
            "notificationUpdated"
          )
        );
      } catch (error) {
        console.log(error);
      }
    };

  // ==========================
  // Notification Click
  // ==========================
  const handleNotificationClick =
    async (item) => {
      try {
        // read notification
        if (!item.isRead) {
          await markNotificationRead(
            item._id
          );

          // update list
          setNotifications(
            (prev) =>
              prev.map((n) =>
                n._id === item._id
                  ? {
                      ...n,
                      isRead: true,
                    }
                  : n
              )
          );

          // navbar update
          window.dispatchEvent(
            new Event(
              "notificationUpdated"
            )
          );
        }

        // redirect
        if (item.link) {
          navigate(item.link);
        }
      } catch (error) {
        console.log(error);
      }
    };

  return (
    <>
      <AdminNavbar />

      <div className="admin-notification-page">

        {/* Top Section */}

        <div className="admin-notification-top">
          <h1>
            Notifications
          </h1>

          {notifications.length >
            0 && (
            <div className="admin-notification-actions">

              <button
                className="admin-mark-read-btn"
                onClick={
                  markAllRead
                }
              >
                Mark All Read
              </button>

              <button
                className="admin-clear-btn"
                onClick={
                  clearAllNotifications
                }
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Empty */}

        {notifications.length ===
        0 ? (
          <div className="admin-empty-box">
            No Notifications
            Found
          </div>
        ) : (
          notifications.map(
            (item) => (
              <div
                key={item._id}
                className={`admin-notification-card ${
                  !item.isRead
                    ? "admin-unread-card"
                    : ""
                }`}
                onClick={() =>
                  handleNotificationClick(
                    item
                  )
                }
              >
                <div className="admin-notification-header">
                  <h3>
                    {
                      item.title
                    }
                  </h3>

                  <span className="admin-notification-type">
                    {
                      item.type
                    }
                  </span>
                </div>

                <p>
                  {
                    item.message
                  }
                </p>

                <small>
                  {new Date(
                    item.createdAt
                  ).toLocaleString()}
                </small>
              </div>
            )
          )
        )}
      </div>
    </>
  );
}

export default Notifications;