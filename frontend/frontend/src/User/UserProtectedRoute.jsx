import { Navigate } from "react-router-dom";

function UserProtectedRoute({ children }) {
  const role = sessionStorage.getItem("role");

  if (role !== "user") {
    return <Navigate to="/Login" replace />;
  }

  return children;
}

export default UserProtectedRoute;