
import { useEffect, useState } from "react";
import axios from "axios";
import "./Courses.css";
import ScrollToTop from "./ScrollToTop";
import Navbar from "./Navbar";
import UserNavbar from "./User/UserNavbar";
import AdminNavbar from "./Admin/AdminNavbar";
import { FaArrowRight, FaStar } from "react-icons/fa";
import { useNavigate,useLocation  } from "react-router-dom";


function Courses() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
const [deleteMode, setDeleteMode] = useState(false);
const [activeCategory, setActiveCategory] =
  useState("All");  
const [filteredCourses, setFilteredCourses] =
  useState([]);

  const navigate = useNavigate();

  const role =
    sessionStorage.getItem("role") ||
    localStorage.getItem("role");

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = {};

      if (token) {
        config.headers = {
          Authorization: `Bearer ${token}`
        };
      }

      const res = await axios.get(
        "https://nextgenprogrammers.onrender.com/CourseDetails",
        config
      );

      setCourses(res.data);
      setFilteredCourses(res.data);

      
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
const filterCourses = (tag) => {
  setActiveCategory(tag);

  if (tag === "All") {
    setFilteredCourses(courses);
    return;
  }

  const filtered = courses.filter(
    (course) =>
      course.tag &&
      course.tag.toLowerCase() ===
      tag.toLowerCase()
  );

  setFilteredCourses(filtered);
};
 

  useEffect(() => {
  const handleBack = () => {
    if (editMode || deleteMode) {
      setEditMode(false);
      setDeleteMode(false);
    }
  };

  window.addEventListener(
    "popstate",
    handleBack
  );

  return () => {
    window.removeEventListener(
      "popstate",
      handleBack
    );
  };
}, [editMode, deleteMode]);

const location = useLocation();
useEffect(() => {
  fetchCourses();

  if (location.state?.resetMode) {
    setEditMode(false);
    setDeleteMode(false);

    window.history.replaceState(
      {},
      document.title
    );
  }
}, [location]);

  const handleDeleteCourse = async (id) => {
  if (!window.confirm("Delete this course?")) return;

  try {
    await axios.delete(
      `https://nextgenprogrammers.onrender.com/CourseDetails/${id}`
    );

    fetchCourses();
    
    alert("Course Deleted Successfully");
  } catch (error) {
    console.log(error);
  }
};


  const renderNavbar = () => {
    if (role === "admin") {
      return (
        <AdminNavbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      );
    }

    if (role === "user") {
      return (
        <UserNavbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      );
    }

    return <Navbar />;
  };

  

  return (
    <>
      {renderNavbar()}
      <ScrollToTop />

      <div
        className={
          role === "admin"
            ? `dashboard-content admin-dashboard-content ${
                !sidebarOpen ? "expanded" : ""
              }`
            : role === "user"
            ? `dashboard-content ${
                !sidebarOpen ? "expanded" : ""
              }`
            : ""
        }
      >
        {role !== "user" && role !== "admin" && (
          <section className="course-header">
            <div className="course-header-content">
              <span className="course-label">
                NEXTGEN PROGRAMMERS
              </span>

              <h1 className="course-heading">
                Learn. Code.
                <br />
                <span>Get Hired.</span>
              </h1>
            </div>
          </section>
        )}

        <section className="course-categories-section">
  <div className="course-categories">

    <button
      className={
        activeCategory === "All"
          ? "course-active"
          : ""
      }
      onClick={() => filterCourses("All")}
    >
      All
    </button>

    <button
      className={
        activeCategory === "Development"
          ? "course-active"
          : ""
      }
      onClick={() =>
        filterCourses("Development")
      }
    >
      Development
    </button>

    <button
      className={
        activeCategory === "Programming"
          ? "course-active"
          : ""
      }
      onClick={() =>
        filterCourses("Programming")
      }
    >
      Programming
    </button>

    <button
      className={
        activeCategory === "Advanced"
          ? "course-active"
          : ""
      }
      onClick={() =>
        filterCourses("Advanced")
      }
    >
      Advanced
    </button>

    <button
      className={
        activeCategory ===
        "Placement Ready"
          ? "course-active"
          : ""
      }
      onClick={() =>
        filterCourses("Placement Ready")
      }
    >
      Placement Ready
    </button>

  </div>
</section>

        {role === "admin" && (
  <div className="admin-course-actions">
    <button
      className="add-btn"
      onClick={() => navigate("/admin/course-form")}
    >
      + Add New Course
    </button>

   <button
  className="edit-btn"
  onClick={() => {
    window.history.pushState(
      { mode: "edit" },
      ""
    );

    setEditMode(!editMode);
    setDeleteMode(false);
  }}
>
  {editMode ? "Cancel Edit" : "Edit Course"}
</button>

<button
  className="delete-btn"
  onClick={() => {
    window.history.pushState(
      { mode: "delete" },
      ""
    );

    setDeleteMode(!deleteMode);
    setEditMode(false);
  }}
>
  {deleteMode
    ? "Cancel Delete"
    : "Delete Course"}
</button>
  </div>
)}

        {loading ? (
          <h2
            style={{
              textAlign: "center",
              marginTop: "40px",
            }}
          >
            Loading Courses...
          </h2>
        ) : (
          <div className="courses-area">
            <section className="course-container">
              {filteredCourses.map((course) => (
                <div
                  className="course-card"
                  key={course._id}
                >
                  <img
                    src={course.image}
                    alt={course.title}
                    className="course-card-image"
                  />

                  <div className="course-card-content">
                    <span className="course-card-tag">
                      {course.tag}
                    </span>

                    <h3 className="course-card-title">
                      {course.title}
                    </h3>

                    <p className="course-card-description">
                      {course.description}
                    </p>

                    <div className="course-card-info">
                      <span>
                        {course.duration}
                      </span>

                      <span className="course-card-rating">
                        <FaStar />
                        {course.rating}
                      </span>
                    </div>

                    <div className="course-price-detail">
                      <h3 className="course-price">
                        {course.price}
                      </h3>

                      <span className="course-discount">
                        {course.discount}
                      </span>
                    </div>

{role === "admin" ? (
  editMode ? (
    <button
      className="edit-btn"
      onClick={() =>
        navigate(
          `/admin/course-form/${course.courseId}`
        )
      }
    >
      Edit Course
    </button>
  ) : deleteMode ? (
    <button
      className="delete-btn"
      onClick={() =>
        handleDeleteCourse(course._id)
      }
    >
      Delete Course
    </button>
  ) : (
    <button
      className="course-btn"
      onClick={() =>
        navigate(
          `/course/${course.courseId}`
        )
      }
    >
      View Details
      <FaArrowRight />
    </button>
  )
) : (
  <button
    className="course-btn"
    onClick={() =>
      navigate(
        `/course/${course.courseId}`
      )
    }
  >
    View Details
    <FaArrowRight />
  </button>
)}
                  </div>
                </div>
              ))}
            </section>
          </div>
        )}
      </div>
    </>
  );
}

export default Courses;

