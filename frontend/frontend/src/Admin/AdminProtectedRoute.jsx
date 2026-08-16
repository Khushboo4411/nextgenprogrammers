import { Navigate } from "react-router-dom";

function AdminProtectedRoute({ children }) {
  const role = sessionStorage.getItem("role");

  if (role !== "admin") {
    return <Navigate to="/Login" replace />;
  }

  return children;
}

export default AdminProtectedRoute;