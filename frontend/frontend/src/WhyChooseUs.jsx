import React from "react";
import "./WhyChooseUs.css";
import hero from "./images/hero.jpg";
import Navbar from "./Navbar";
import ScrollToTop from "./ScrollToTop";
import { useNavigate } from "react-router-dom";

function WhyChooseUS() {
  const features = [
    {
      title: "Recorded Video Classes",
      desc: "Learn at your own pace with high-quality content",
      icon: "💻",
    },
    {
      title: "Hands-on Projects",
      desc: "Build real-world projects for portfolio",
      icon: "🛠️",
    },
    {
      title: "Placement Assistance",
      desc: "Get job referrals & interview support",
      icon: "💼",
    },
    {
      title: "Certification",
      desc: "Industry-recognized certificates",
      icon: "📜",
    },
    {
      title: "24/7 Support",
      desc: "Instant help from mentors anytime",
      icon: "🎧",
    },
  ];
   

  const navigate=useNavigate();

  const gotoCourses=()=>{
    navigate('/Courses');
  }
  return (
    <>
      <Navbar />
      <ScrollToTop />

      <div className="why-page">

        {/* HERO SECTION */}
        <section className="why-hero">

          <div className="why-hero-content">

            <h1>
              Why Choose <span>Us?</span>
            </h1>

            <p>
              Your career doesn’t change by chance,
              it changes by choice.
            </p>

            <button className="why-hero-btn">
              Explore Advantages
            </button>

          </div>

          <img
            src={hero}
            alt="students"
            className="why-hero-image"
          />

        </section>

        {/* FEATURES SECTION */}
        <section className="why-features">

          <h2>Why Students Trust Us</h2>

          <div className="why-feature-grid">

            {features.map((item, index) => (
              <div
                key={index}
                className="why-feature-card"
              >

                <h1>{item.icon}</h1>

                <h3>{item.title}</h3>

                <p>{item.desc}</p>

              </div>
            ))}

          </div>

        </section>

        {/* LEARNING JOURNEY */}
        <section className="why-journey">

          <h2>Your Learning Journey</h2>

          <div className="why-timeline">

            <div className="why-step">Join</div>

            <div className="why-step">Learn</div>

            <div className="why-step">Build</div>

            <div className="why-step">Certify</div>

            <div className="why-step">Interview</div>

            <div className="why-step">Placed</div>

          </div>

        </section>

        {/* STATS SECTION */}
        <section className="why-stats">

          <div className="why-stat-box">
            <h1>500+</h1>
            <p>Students Trained</p>
          </div>

          <div className="why-stat-box">
            <h1>400+</h1>
            <p>Placements</p>
          </div>

          <div className="why-stat-box">
            <h1>10+</h1>
            <p>Mentors</p>
          </div>

          <div className="why-stat-box">
            <h1>95%</h1>
            <p>Success Rate</p>
          </div>

        </section>

        {/* CTA SECTION */}
        <section className="why-cta">

          <h1>
            Ready to Start Your Journey?
          </h1>

          <p>
            Join thousands of learners building
            their tech careers.
          </p>

          <button className="why-cta-btn"  onClick={gotoCourses}>
            Explore Courses
          </button>

        </section>

      </div>
    </>
  );
}

export default WhyChooseUS;