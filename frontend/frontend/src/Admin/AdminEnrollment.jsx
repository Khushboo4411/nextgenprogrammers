import React, {
  useEffect,
  useState,
} from "react";
import axios from "axios";
import "./AdminEnrollment.css";
import AdminNavbar from "./AdminNavbar";
function AdminEnrollment() {
  console.log("Admin Enrollment Loaded");
  const [enrollments, setEnrollments] =
    useState([]);

  useEffect(() => {
    fetchEnrollments();
  }, []);

const fetchEnrollments = async () => {
  try {
    const res = await axios.get(
      "https://nextgenprogrammers.onrender.com/admin/enrollments"
    );

    console.log(res.data);

    setEnrollments(res.data);
  } catch (error) {
    console.log(error);
  }
};
const handleDelete = async (id) => {
    console.log("Deleting ID:", id);

  try {
    const res = await fetch(
      `https://nextgenprogrammers.onrender.com/enrollments/${id}`,
      {
        method: "DELETE",
      }
    );

    const data = await res.json();

    if (res.ok) {
      setEnrollments(
        enrollments.filter((item) => item._id !== id)
      );
      alert("Enrollment deleted successfully");
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error(error);
    alert("Error deleting enrollment");
  }
};
  return (
        <>
        <AdminNavbar />

    <div className="admin-enrollment-page">
      <h2 className="admin-enrollment-title">
        Student Enrollments
      </h2>

      {enrollments.length === 0 ? (
        <div className="no-enrollment">
          No Enrollment Found
        </div>
      ) : (
        <table className="admin-enrollment-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Email</th>
              <th>Course</th>
              
              <th>Progress</th>
              <th>Date</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {enrollments.map((item) => (
              <tr key={item._id}>
                <td>
                  {item.userId?.name}
                </td>

                <td>
                  {item.userId?.email}
                </td>

               

                <td>
                  {item.courseId}
                </td>

                <td>
                  <span className="progress-badge">
                    {item.progress}%
                  </span>
                </td>

                <td>
                  {new Date(
                    item.enrolledAt
                  ).toLocaleDateString()}
                </td>
                 <button onClick={() => handleDelete(item._id)} className="delete-btn">
  Delete
</button>
              </tr>
              
            ))}
          </tbody>
        </table>
      )}
    </div>
        </>
  );
}

export default AdminEnrollment;