import React, { useState } from "react";
import "./Testimonials.css";
import Navbar from "./Navbar";
import ScrollToTop from "./ScrollToTop";

function Testimonials() {

  const testimonials = [
     {
      name: "Riya Das",
      role: "Frontend Student",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHiAuUKyTwSOmeipYTwmukjfYQwd0UP_v8qFyKSjyEOg&s=10",
      review:
        "The UI design lessons improved my creativity and helped me build responsive websites.",
    },
    {
      name: "Deepak Kumar",
      role: "DSA Student",
      image: "https://randomuser.me/api/portraits/men/71.jpg",
      review:
        "The DSA course significantly improved my problem-solving and interview preparation skills.",
    },
    {
      name: "Shreya Mishra",
      role: "Machine Learning Student",
      image: "https://www.shutterstock.com/image-photo/closeup-portrait-smiling-young-indian-260nw-2427223007.jpg",
      review:
        "Real-world datasets and projects made machine learning concepts easy to understand.",
    },
    {
      name: "Arjun Gupta",
      role: "Software Engineer",
      image: "https://t4.ftcdn.net/jpg/08/70/43/15/360_F_870431582_Jjd77qJ25YtxLtb8h5kIMdMZAZXzFKC9.jpg",
      review:
        "Thanks to NextGen Programmers, I gained the skills and confidence needed for my first tech job.",
    },
    {
      name: "Anvi Kumari",
      role: "MERN Stack Student",
      image: "data:image/jpeg;base64,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",
      review:
        "The MERN Stack course helped me build real-world projects and improve my coding skills significantly.",
    },
    {
      name: "Priya Sharma",
      role: "Java Full Stack Student",
      image: "data:image/jpeg;base64,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",
      review:
        "Amazing mentors and excellent guidance throughout the learning journey.",
    },
    {
      name: "Rahul Verma",
      role: "Python Student",
      image: "data:image/jpeg;base64,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",
      review:
        "The teaching style is practical and easy to understand. Highly recommended for beginners.",
    },
    {
      name: "Sneha Gupta",
      role: "Frontend Developer",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpjiUdVJu4WHqGs2747213Q7wFur6IhAPyoowIwO5_-w&s=10",
      review:
        "I learned React from scratch and built multiple projects that strengthened my portfolio.",
    },
    {
      name: "Rohit Singh",
      role: "Java Developer",
      image: "https://randomuser.me/api/portraits/men/22.jpg",
      review:
        "The practical assignments and mentor support made learning enjoyable and effective.",
    },
    {
      name: "Neha Kumari",
      role: "Data Science Student",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVxCerlTvXuKWurwzg48bfGFX6V19w8TfR0XjTRYtioA&s=10",
      review:
        "Excellent curriculum and hands-on machine learning projects helped me gain confidence.",
    },
    {
      name: "Vikas Sharma",
      role: "MERN Developer",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS22B4MpL5Lu4NF-eF4CdpZva49cSgNFm6HQu1cq8Y0sQ&s=10",
      review:
        "The instructors explained concepts clearly and helped me solve real-world coding challenges.",
    },
    {
      name: "Anjali Verma",
      role: "Python Developer",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTWtLKLMAOXgnM76Gmsmkx9b4M1V4FD-m2onBoQV6mXw&s=10",
      review:
        "The Python course was beginner-friendly and covered everything from basics to advanced topics.",
    },
    {
      name: "Aditya Raj",
      role: "Android Developer",
      image: "https://randomuser.me/api/portraits/men/47.jpg",
      review:
        "Building Android applications during the course gave me practical industry experience.",
    },
    {
      name: "Pooja Sinha",
      role: "Flutter Student",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGRTVdFGCRsBQzyilxpwjBU151sgBcZkrHhWetQ4kW6w&s=10",
      review:
        "The Flutter training was excellent and helped me develop cross-platform mobile apps.",
    },
    {
      name: "Karan Patel",
      role: "Backend Developer",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThNig1ogZ9N-AAIpnHdiLdaQQyvAOjGpDymEEHxX0-PQ&s=10",
      review:
        "Node.js and Express concepts were taught in a structured and easy-to-understand way.",
    },
   
  ];

  const [currentReview, setCurrentReview] = useState(0);

  const nextReview = () => {
    setCurrentReview(
      currentReview === testimonials.length - 1
        ? 0
        : currentReview + 1
    );
  };

  const prevReview = () => {
    setCurrentReview(
      currentReview === 0
        ? testimonials.length - 1
        : currentReview - 1
    );
  };

  return (
    <>
        <Navbar />
        <ScrollToTop/>
    <div className="testimonial-page">

      <section className="testimonial-hero">

        <span className="testimonial-label">
          STUDENT SUCCESS STORIES
        </span>

        <h1>
          What Our <span>Students Say</span>
        </h1>

        <p>
          Thousands of students have transformed their careers
          with NextGen Programmers.
        </p>

      </section>

      <section className="testimonial-section">

        <div className="testimonial-card">

          <img
            src={testimonials[currentReview].image}
            alt={testimonials[currentReview].name}
            className="student-image"
          />

          <h2>
            {testimonials[currentReview].name}
          </h2>

          <span className="student-role">
            {testimonials[currentReview].role}
          </span>

          <div className="stars">
            ⭐⭐⭐⭐⭐
          </div>

          <p className="review">
            "{testimonials[currentReview].review}"
          </p>

          <div className="testimonial-buttons">

            <button onClick={prevReview}>
              ← Previous
            </button>

            <button onClick={nextReview}>
              Next →
            </button>

          </div>

          <div className="dots">

            {testimonials.map((_, index) => (
              <span
                key={index}
                className={
                  currentReview === index
                    ? "dot active-dot"
                    : "dot"
                }
                onClick={() => setCurrentReview(index)}
              ></span>
            ))}

          </div>

        </div>

      </section>

    </div>
    </>
    
  );
}

export default Testimonials;