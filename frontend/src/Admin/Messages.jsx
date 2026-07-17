import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";
import AdminNavbar from "./AdminNavbar";
import "./Messages.css";

function Messages() {
  const [messages, setMessages] =
    useState([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        "https://nextgenprogrammers.onrender.com/Messages"
      );

      setMessages(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this message?"
  );

  if (!confirmDelete) return;

  try {
    await axios.delete(
      `https://nextgenprogrammers.onrender.com/Messages/${id}`
    );

    setMessages(
      messages.filter(
        (msg) => msg._id !== id
      )
    );

    alert("Message Deleted");
  } catch (error) {
    console.log(error);
  }
};

const handleDeleteAll = async () => {

  const confirmDelete =
    window.confirm(
      "Are you sure you want to delete all messages?"
    );

  if (!confirmDelete) return;

  try {

    await axios.delete(
      "https://nextgenprogrammers.onrender.com/Messages"
    );

    setMessages([]);

    alert(
      "All Messages Deleted Successfully"
    );

  } catch (error) {

    console.log(error);

    alert(
      "Failed to delete messages"
    );
  }
};


  return (
    <>
      <AdminNavbar />

      <div className="messages-page">
        <h1>Student Messages</h1>

<div className="delete-all-container">

  

  {messages.length > 0 && (
    <button
      className="delete-all-btn"
      onClick={handleDeleteAll}
    >
      Delete All
    </button>
  )}

</div>
        <div className="messages-container">
          {messages.length === 0 ? (
            <h3>No Messages Found</h3>
          ) : (
            messages.map((msg) => (
              <div
                className="message-card"
                key={msg._id}
              >
                <h3>Name:{msg.name}</h3>

                <p>
                  <strong>Email:</strong>{" "}
                  {msg.email}
                </p>

                <p>
                  <strong>Subject:</strong>{" "}
                  {msg.subject}
                </p>

                <p>
                  <strong>Message:</strong>
                </p>

                <div className="message-box">
                  {msg.message}
                </div>

              <div className="message-actions">

  <button
    className="reply-btn"
    onClick={() =>
      window.location.href =
        `mailto:${msg.email}?subject=Re: ${msg.subject}`
    }
  >
    Reply
  </button>

  <button
    className="delete-btn"
    onClick={() =>
      handleDelete(msg._id)
    }
  >
    Delete
  </button>

</div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Messages;