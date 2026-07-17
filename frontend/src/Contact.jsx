import "./Contact.css";
import teamImg from "./images/contact-team.jpg";
import Navbar from "./Navbar";
import UserNavbar from "./User/UserNavbar";
import ScrollToTop from "./ScrollToTop";
import React, { useRef, useState } from "react";

function Contact() {

  const role = sessionStorage.getItem("role");
  const isUserLoggedIn = role === "user";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const formRef = useRef(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(
        "https://nextgenprogrammers.onrender.com/contactinfo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMsg("Message sent successfully!");

        setTimeout(() => {
          setMsg("");
        }, 800);

        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        setMsg(data.message || "Failed to send message");

        setTimeout(() => {
          setMsg("");
        }, 800);
      }
    } catch (error) {
      console.log(error);
      setMsg("Server Error");
    }

    setLoading(false);
  };

  const handleLetsTalk = () => {
    formRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      {isUserLoggedIn ? (
        <UserNavbar />
      ) : (
        <Navbar />
      )}

      <ScrollToTop />

      <div className="contact-page">

        {!isUserLoggedIn && (
          <section className="contact-hero">

            <div className="contact-hero-left">

              <h1>
                Contact <span>Us</span>
              </h1>

              <div className="hero-line"></div>

              <h2>
                We're Here To Help You Succeed!
              </h2>

              <p>
                Have questions or need guidance?
                Our team is ready to assist you on
                your journey to success.
              </p>

              <button
                className="talk-btn"
                onClick={handleLetsTalk}
              >
                Let's Talk →
              </button>

            </div>

            <div className="contact-hero-right">
              <img
                src={teamImg}
                alt="Contact Team"
              />
            </div>

          </section>
        )}

       <section
  className={`contact-content ${
    isUserLoggedIn ? "user-contact-content" : ""
  }`}
>
          <div className="contact-info-card">

            <div>

              <h2>Get In Touch</h2>

              <div className="small-line"></div>

              <p className="info-intro">
                Reach out through any of the following
                channels.
              </p>

              <div className="info-box">

                <div className="icon email">
                  📧
                </div>

                <div>

                  <h4>Email Address</h4>

                  <p>
                    info@nextgenprogrammers.com
                  </p>

                  <p>
                    admissions@nextgenprogrammers.com
                  </p>

                </div>

              </div>

              <div className="info-box">

                <div className="icon phone">
                  📞
                </div>

                <div>

                  <h4>Phone Number</h4>

                  <p>+91 9876543210</p>

                  <p>+91 9123456789</p>

                </div>

              </div>

              <div className="info-box">

                <div className="icon address">
                  📍
                </div>

                <div>

                  <h4>Our Center</h4>

                  <p>709f Yashwant Nagar, Hazaribagh, Jharkhand</p>

                  <p>India - 825301</p>

                </div>

              </div>

            </div>

            <div className="contact-card-bottom">

              <h3>🎓 NextGen Programmers</h3>

              <span>
                Building Future Developers
              </span>

            </div>

          </div>
                    <div
            className="contact-form-card"
            ref={formRef}
          >

            <h2>Send us a Message</h2>

            {msg && (
              <div className="success-message">
                {msg}
              </div>
            )}

            <div className="small-line"></div>

            <form onSubmit={handleSubmit}>

              <div className="form-group">

                <label>Full Name</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />

              </div>

              <div className="form-group">

                <label>Email Address</label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  required
                />

              </div>

              <div className="form-group">

                <label>Subject</label>

                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select Course
                  </option>

                  <option value="MERN Stack Development">
                    MERN Stack Development
                  </option>

                  <option value="Java Full Stack Development">
                    Java Full Stack Development
                  </option>

                  <option value="Python Full Stack Development">
                    Python Full Stack Development
                  </option>

                  <option value="Frontend Development">
                    Frontend Development
                  </option>

                  <option value="Backend Development">
                    Backend Development
                  </option>

                  <option value="React JS Development">
                    React JS Development
                  </option>

                  <option value="Node JS Development">
                    Node JS Development
                  </option>

                  <option value="MongoDB Development">
                    MongoDB Development
                  </option>

                  <option value="JavaScript Mastery">
                    JavaScript Mastery
                  </option>

                  <option value="Data Structures & Algorithms">
                    Data Structures &
                    Algorithms
                  </option>

                  <option value="Web Development Bootcamp">
                    Web Development
                    Bootcamp
                  </option>

                  <option value="Placement Preparation">
                    Placement Preparation
                  </option>

                  <option value="Career Guidance">
                    Career Guidance
                  </option>

                  <option value="General Inquiry">
                    General Inquiry
                  </option>

                </select>

              </div>

              <div className="form-group">

                <label>Message</label>

                <textarea
                  rows="6"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message..."
                  required
                />

              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                {loading
                  ? "Sending..."
                  : "Send Message"}
              </button>

            </form>

          </div>

        </section>

        {!isUserLoggedIn && (

          <footer className="contact-footer">

            <p className="footer-quote">
              “We don't just teach, we inspire
              you to achieve greatness.”
            </p>

            <div className="contact-logo">

              <div className="contact-logo-icon">
                🎓
              </div>

              <div>

                <h3>
                  NextGen Programmers
                </h3>

              </div>

            </div>

          </footer>

        )}

      </div>

    </>

  );

}

export default Contact;