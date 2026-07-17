import React from "react";
import "./Home.css";
import background from "./images/background.png";
import Navbar from "./Navbar";
import Courses from "./Courses";
import About from "./About";
import Contact from "./Contact";
import WhyChooseUs from "./WhyChooseUs";

import {
  FaPlay,
  FaUserGraduate,
  FaBookOpen,
  FaRocket,
} from "react-icons/fa";


import { useNavigate } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import Testimonials from "./Testimonials";

function Home() {
  const navigate = useNavigate();

  const gotoCourses = () => {
    navigate("/Courses");
  };

  return (
    <>
      <ScrollToTop />
      <Navbar />

      <section className="home-hero">

        {/* LEFT */}
        <div className="home-hero-left">

          <span className="home-hero-badge">
            BUILD YOUR FUTURE
          </span>

          <h1>
            Learn Skills.
            <br />
            Build <span>Dreams.</span>
          </h1>

          <p>
            Explore industry-oriented courses and upskill with
            hands-on projects designed for real-world success.
          </p>

          <div className="home-hero-buttons">

            <button className="home-browse-btn" onClick={gotoCourses}>
              Browse Courses
            </button>

            <button className="home-watch-btn"  onClick={() =>window.open("https://youtu.be/yjtCQtADhDY?si=JQZld0FnnS7h1WkT", "_blank")}>
              <FaPlay />
              Watch Demo
            </button>

          </div>

          <div className="home-hero-stats">

            <div className="home-stat-item">
              <FaUserGraduate />
              <div>
                <h4>1K+</h4>
                <p>Students Enrolled</p>
              </div>
            </div>

            <div className="home-stat-item">
              <FaBookOpen />
              <div>
                <h4>10+</h4>
                <p>Premium Courses</p>
              </div>
            </div>

            <div className="home-stat-item">
              <FaRocket />
              <div>
                <h4>95%</h4>
                <p>Placement Support</p>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT */}
        <div className="home-hero-right">

          <img
            src={background}
            alt="Student"
            className="home-hero-image"
          />

        

        </div>

      </section>

      <Courses />
      <About />
      <WhyChooseUs />
      <Testimonials/>
      <Contact />
    </>
  );
}

export default Home;