import React from "react";
import { Navigate } from "react-router-dom";

// Generic Private Route
const PrivateRoute = ({ children, roleRequired }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // No token → redirect to login
  if (!token) return <Navigate to="/" />;

  // Role required but does not match → redirect to appropriate dashboard
  if (roleRequired && role !== roleRequired.toLowerCase()) {
    return role === "admin" ? (
      <Navigate to="/admin/dashboard" />
    ) : (
      <Navigate to="/user/home" />
    );
  }

  return children;
};

export default PrivateRoute;