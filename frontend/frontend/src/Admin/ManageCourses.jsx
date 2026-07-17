
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import "./ManageCourses.css";

function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const res = await axios.get(
        "https://nextgenprogrammers.onrender.com/Courses"
      );

      setCourses(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDeleteCourse = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this course?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `https://nextgenprogrammers.onrender.com/Courses/${id}`
      );

      alert("Course Deleted Successfully");

      fetchCourses();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="manage-courses-page">
        <div className="manage-header">
          <h2>Manage Courses</h2>

          <button
            className="add-course-btn"
            onClick={() =>
              navigate("/admin/course-form")
            }
          >
            + Add New Course
          </button>
        </div>

        {loading ? (
          <h3>Loading...</h3>
        ) : (
          <div className="manage-course-grid">
            {courses.map((course) => (
              <div
                className="manage-course-card"
                key={course._id}
              >
                <img
                  src={course.image}
                  alt={course.title}
                />

                <div className="manage-card-content">
                  <h3>{course.title}</h3>

                  <p>{course.description}</p>

                  <div className="manage-actions">
                    <button
                      className="edit-btn"
                      onClick={() =>
                        navigate(
                          `/admin/course-form/${course.courseId}`
                        )
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn1"
                      onClick={() =>
                        handleDeleteCourse(course._id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default ManageCourses;

