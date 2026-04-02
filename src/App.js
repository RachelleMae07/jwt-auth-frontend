// App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Login from "./pages/user/Login";
import Home from "./pages/user/Home";
import ServicesCrudApp from "./pages/user/ServicesCrudApp";
import Notifications from "./pages/user/Notifications";
import Booking from "./components/Bookings"; // <-- New Booking page

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBookings from "./pages/admin/AdminBookings";

import Navbar from "./components/Navbar";

/* 🔐 PrivateRoute with role check */
const PrivateRoute = ({ children, roleRequired }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role")?.toLowerCase();

  // No token → redirect to login
  if (!token) return <Navigate to="/" replace />;

  // Role required but does not match → redirect to correct dashboard
  if (roleRequired && role !== roleRequired.toLowerCase()) {
    return role === "admin" ? (
      <Navigate to="/admin/dashboard" replace />
    ) : (
      <Navigate to="/user/home" replace />
    );
  }

  return children;
};

/* 🧩 Layout (hide navbar only on login page) */
const Layout = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const isLoginPage = location.pathname === "/";
  const showNavbar = token && !isLoginPage;

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
    </>
  );
};

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* 👤 User Routes */}
        <Route
          path="/user/home"
          element={
            <PrivateRoute roleRequired="user">
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/notifications"
          element={
            <PrivateRoute roleRequired="user">
              <Notifications />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/booking"
          element={
            <PrivateRoute roleRequired="user">
              <Booking />
            </PrivateRoute>
          }
        />

        {/* 🌟 Services page is PUBLIC */}
        <Route path="/services" element={<ServicesCrudApp />} />

        {/* 👑 Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute roleRequired="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <PrivateRoute roleRequired="admin">
              <AdminBookings />
            </PrivateRoute>
          }
        />

        {/* Redirect /admin → dashboard */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;