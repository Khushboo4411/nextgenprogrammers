import React, { useState } from "react";
import axios from "axios";
import UserNavbar from "./UserNavbar";
import "./Help.css";

function Help() {
  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const [formData, setFormData] =
    useState({
      name:
        sessionStorage.getItem(
          "name"
        ) || "",
      email:
        sessionStorage.getItem(
          "email"
        ) || "",
      subject: "",
      message: "",
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "https://nextgenprogrammers.onrender.com/contactinfo",
        formData
      );

      alert(
        "Message sent successfully"
      );

      setFormData({
        ...formData,
        subject: "",
        message: "",
      });
    } catch (error) {
      console.log(error);

      alert(
        "Failed to send message"
      );
    }
  };

  return (
    <div className="app-layout">
      <UserNavbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={
          setSidebarOpen
        }
      />

      <div
        className={`help-page ${
          !sidebarOpen
            ? "expanded"
            : ""
        }`}
      >
        <div className="help-container">

  <div className="help-header">
    <h1>Help & Support</h1>
    <p>
      Need help? Send your query to our support team.
    </p>
  </div>

          <form
            className="help-form"
            onSubmit={
              handleSubmit
            }
          >
            <div className="form-group">
              <label>
                Name
              </label>

              <input
                type="text"
                value={
                  formData.name
                }
                readOnly
              />
            </div>

            <div className="form-group">
              <label>
                Email
              </label>

              <input
                type="email"
                value={
                  formData.email
                }
                readOnly
              />
            </div>

            <div className="form-group">
              <label>
                Subject
              </label>

              <select
                name="subject"
                value={
                  formData.subject
                }
                onChange={
                  handleChange
                }
                required
              >
                <option value="">
                  Select
                  Subject
                </option>

                <option value="MERN Stack Development">
                  MERN Stack
                  Development
                </option>

                <option value="Java Full Stack Development">
                  Java Full
                  Stack
                  Development
                </option>

                <option value="Python Full Stack Development">
                  Python Full
                  Stack
                  Development
                </option>

                <option value="Frontend Development">
                  Frontend
                  Development
                </option>

                <option value="Backend Development">
                  Backend
                  Development
                </option>

                <option value="React JS Development">
                  React JS
                  Development
                </option>

                <option value="Node JS Development">
                  Node JS
                  Development
                </option>

                <option value="MongoDB Development">
                  MongoDB
                  Development
                </option>

                <option value="JavaScript Mastery">
                  JavaScript
                  Mastery
                </option>

                <option value="Data Structures & Algorithms">
                  Data
                  Structures &
                  Algorithms
                </option>

                <option value="Web Development Bootcamp">
                  Web
                  Development
                  Bootcamp
                </option>

                <option value="Placement Preparation">
                  Placement
                  Preparation
                </option>

                <option value="Career Guidance">
                  Career
                  Guidance
                </option>

                <option value="Technical Issue">
                  Technical
                  Issue
                </option>

                <option value="Payment Issue">
                  Payment
                  Issue
                </option>

                <option value="Certificate Issue">
                  Certificate
                  Issue
                </option>

                <option value="Course Access Problem">
                  Course
                  Access
                  Problem
                </option>

                <option value="Assignment Issue">
                  Assignment
                  Issue
                </option>

                <option value="Lecture Issue">
                  Lecture
                  Issue
                </option>

                <option value="General Inquiry">
                  General
                  Inquiry
                </option>
              </select>
            </div>

            <div className="form-group">
              <label>
                Message
              </label>

              <textarea
                name="message"
                rows="5"
                placeholder="Describe your problem..."
                value={
                  formData.message
                }
                onChange={
                  handleChange
                }
                required
              />
            </div>

            <button
              className="help-btn"
              type="submit"
            >
              Send
              Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Help;