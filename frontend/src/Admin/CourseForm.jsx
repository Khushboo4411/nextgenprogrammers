import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import "./CourseForm.css";

function CourseForm() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    courseId: "",
    image: "",
    title: "",
    description: "",
    duration: "",
    rating: "",
    price: "",
    discount: "",
    tag: "",
    projects: "",
    skills: "",
  });

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  useEffect(() => {
    window.history.pushState(
      null,
      "",
      window.location.href
    );

    const handleBackButton = () => {
      navigate("/Admin/Courses", {
        replace: true,
        state: {
          resetMode: true,
        },
      });
    };

    window.addEventListener(
      "popstate",
      handleBackButton
    );

    return () => {
      window.removeEventListener(
        "popstate",
        handleBackButton
      );
    };
  }, [navigate]);

  const fetchCourse = async () => {
    try {
      const courseRes = await axios.get(
        `https://nextgenprogrammers.onrender.com/CompleteCourse/${courseId}`
      );

      const data = courseRes.data;

      setFormData({
        courseId: data.courseId || "",
        image: data.image || "",
        title: data.title || "",
        description: data.description || "",
        duration: data.duration || "",
        rating: data.rating || "",
        price: data.price || "",
        discount: data.discount || "",
        tag: data.tag || "",
        projects: data.projects?.join(", ") || "",
        skills: data.skills?.join(", ") || "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
      };

      if (courseId) {
        await axios.put(
          `https://nextgenprogrammers.onrender.com/UpdateCompleteCourse/${courseId}`,
          payload
        );

        alert("Course Updated Successfully");
      } else {
        await axios.post(
          "https://nextgenprogrammers.onrender.com/AddCompleteCourse",
          payload
        );

        alert("Course Added Successfully");
      }

      navigate("/Admin/Courses", {
        replace: true,
        state: {
          resetMode: true,
        },
      });
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="course-form-page">
        <div className="course-form-card">
          <h2>
            {courseId
              ? "Edit Course"
              : "Add New Course"}
          </h2>

          <input
            type="text"
            name="courseId"
            placeholder="Course ID"
            value={formData.courseId}
            onChange={handleChange}
            disabled={courseId}
          />

          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={formData.image}
            onChange={handleChange}
          />

          <input
            type="text"
            name="title"
            placeholder="Course Title"
            value={formData.title}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />

          <input
            type="text"
            name="duration"
            placeholder="Duration"
            value={formData.duration}
            onChange={handleChange}
          />

          <input
            type="number"
            name="rating"
            placeholder="Rating"
            value={formData.rating}
            onChange={handleChange}
          />

          <input
            type="text"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
          />

          <input
            type="text"
            name="discount"
            placeholder="Discount"
            value={formData.discount}
            onChange={handleChange}
          />

          <input
            type="text"
            name="tag"
            placeholder="Tag"
            value={formData.tag}
            onChange={handleChange}
          />

          <textarea
            name="projects"
            placeholder="Projects (comma separated)"
            value={formData.projects}
            onChange={handleChange}
          />

          <textarea
            name="skills"
            placeholder="Skills (comma separated)"
            value={formData.skills}
            onChange={handleChange}
          />

          <div className="course-form-buttons">
            <button
              className="save-course-btn"
              onClick={handleSubmit}
            >
              {courseId
                ? "Update Course"
                : "Add Course"}
            </button>

            <button
              className="cancel-btn"
              onClick={() =>
                navigate("/Admin/Courses", {
                  replace: true,
                  state: {
                    resetMode: true,
                  },
                })
              }
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CourseForm;