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
import Booking from "./components/Bookings";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBookings from "./pages/admin/AdminBookings";

import Navbar from "./components/Navbar";

const PrivateRoute = ({ children, roleRequired }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role")?.toLowerCase();

  if (!token) return <Navigate to="/" replace />;

  if (roleRequired && role !== roleRequired) {
    return role === "admin" ? (
      <Navigate to="/admin/dashboard" replace />
    ) : (
      <Navigate to="/user/home" replace />
    );
  }

  return children;
};

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
        <Route path="/" element={<Login />} />

        <Route
          path="/user/home"
          element={
            <PrivateRoute roleRequired="user">
              <Home />
            </PrivateRoute>
          }
        />

        <Route
          path="/user/services"
          element={
            <PrivateRoute roleRequired="user">
              <ServicesCrudApp />
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

        <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
        <Route path="*" element={<Navigate to="/" />} />
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