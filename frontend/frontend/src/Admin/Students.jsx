import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";
import "./Students.css";
import { FaTrash } from "react-icons/fa";

function Students() {
  const [students, setStudents] = useState([]);
  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(
        "https://nextgenprogrammers.onrender.com/Students"
      );

      setStudents(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteStudent = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this student?"
  );

  if (!confirmDelete) return;

  try {
    await axios.delete(
      `https://nextgenprogrammers.onrender.com/Students/${id}`
    );

    alert("Student Deleted Successfully");

    fetchStudents();
  } catch (error) {
    console.log(error);
    alert("Delete Failed");
  }
};

  return (
    <>
      <AdminNavbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div
        className={`students-page ${
          !sidebarOpen ? "expanded" : ""
        }`}
      >
        <h1>Students</h1>

        <div className="students-table-wrapper">
          <table className="students-table">
            <thead>
              <tr>
               
                <th>ID</th>
                <th>Profile</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
                
              </tr>
            </thead>

            <tbody>
              {students.map(
                (student, index) => (
                  <tr key={student._id}>
  <td>{index + 1}</td>

  <td>
    <img
      src={
        student.profileImage ||
        `https://ui-avatars.com/api/?name=${student.name}`
      }
      alt=""
      className="student-img"
    />
  </td>

  <td>{student.name}</td>

  <td>{student.email}</td>

  <td>{student.role}</td>

  <td>
    <button
      className="delete-student-btn"
      onClick={() =>
        handleDeleteStudent(student._id)
      }
    >
      <FaTrash />
      Delete
    </button>
  </td>
</tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Students;