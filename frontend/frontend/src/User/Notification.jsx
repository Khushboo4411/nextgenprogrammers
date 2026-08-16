import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";
import UserNavbar from "./UserNavbar";
import "./Notification.css";
import { useNavigate } from "react-router-dom";

function Notifications() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const [notifications, setNotifications] =
    useState([]);

  // ==========================
  // Load Notifications
  // ==========================
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const userId =
        sessionStorage.getItem(
          "userId"
        );

      const res = await axios.get(
        `https://nextgenprogrammers.onrender.com/notifications/${userId}`
      );

      setNotifications(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ==========================
  // Read Single Notification
  // ==========================
  const markRead = async (id) => {
    try {
      await axios.put(
        `https://nextgenprogrammers.onrender.com/notifications/read/${id}`
      );
    } catch (error) {
      console.log(error);
    }
  };

  // ==========================
  // Read All Notifications
  // ==========================
  const readAllNotifications =
    async () => {
      try {
        const userId =
          sessionStorage.getItem(
            "userId"
          );

        await axios.put(
          `https://nextgenprogrammers.onrender.com/notifications/read-all/${userId}`
        );

        setNotifications(
          notifications.map(
            (item) => ({
              ...item,
              isRead: true,
            })
          )
        );

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
        // mark as read
        if (!item.isRead) {
          await markRead(
            item._id
          );

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
    <div className="user-app-layout">
      <UserNavbar
        sidebarOpen={
          sidebarOpen
        }
        setSidebarOpen={
          setSidebarOpen
        }
      />

      <div
        className={`user-notification-page ${
          !sidebarOpen
            ? "user-expanded"
            : ""
        }`}
      >
        {/* Header */}

        <div className="user-notification-header">
          <h1>
            Notifications
          </h1>

          {notifications.length >
            0 && (
            <div className="user-notification-actions">
              <button
                className="user-read-all-btn"
                onClick={
                  readAllNotifications
                }
              >
                Read All
              </button>

              <button
                className="user-clear-btn"
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
          <div className="user-no-notification">
            <h3>
              No Notifications
              Found
            </h3>
          </div>
        ) : (
          <div className="user-notification-list">
            {notifications.map(
              (item) => (
                <div
                  key={item._id}
                  className={`user-notification-card ${
                    !item.isRead
                      ? "user-unread-card"
                      : ""
                  }`}
                  onClick={() =>
                    handleNotificationClick(
                      item
                    )
                  }
                >
                  <div className="user-notification-top">
                    <h3>
                      {
                        item.title
                      }
                    </h3>

                    {!item.isRead && (
                      <span className="user-new-badge">
                        New
                      </span>
                    )}
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;