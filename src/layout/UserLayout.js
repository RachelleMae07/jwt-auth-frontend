import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

function UserLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      {/* NAVBAR */}
      <nav style={styles.nav}>
        <h3 style={{ color: "#fff" }}>Mae's Salon</h3>

        <div style={styles.links}>
          <Link to="/home" style={styles.link}>Home</Link>
          <Link to="/services" style={styles.link}>Services</Link>
          <Link to="/notifications" style={styles.link}>Notifications</Link>
        </div>

        <button onClick={logout} style={styles.logout}>
          Logout
        </button>
      </nav>

      {/* PAGE CONTENT */}
      <Outlet />
    </div>
  );
}

const styles = {
  nav: {
    height: "70px",
    background: "#111",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
  },
  links: {
    display: "flex",
    gap: "20px",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
  },
  logout: {
    background: "red",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    cursor: "pointer",
  },
};

export default UserLayout;