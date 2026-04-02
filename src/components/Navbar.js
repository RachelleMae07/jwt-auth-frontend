import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role")?.toLowerCase();

  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <style>{`
        /* ================= USER NAVBAR ================= */
        .user-navbar {
          padding: 12px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(10, 10, 20, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
          position: sticky;
          top: 0;
          z-index: 1000;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logo {
          font-family: "Pacifico", cursive;
          font-size: 2rem;
          color: #db1bae;
          margin: 0;
        }

        .links {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          color: #f0f0f0;
          text-decoration: none;
          font-weight: 500;
          border-radius: 30px;
          transition: all 0.3s ease;
        }

        .nav-link:hover {
          background: rgba(219, 27, 174, 0.2);
          transform: scale(1.05);
        }

        .nav-link.active {
          color: #db1bae;
          background: rgba(219, 27, 174, 0.15);
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 20px;
          border-radius: 30px;
          border: 1px solid rgba(219, 27, 174, 0.5);
          background: rgba(219, 27, 174, 0.2);
          color: #fff;
          cursor: pointer;
          transition: 0.3s;
        }

        .logout-btn:hover {
          background: rgba(219, 27, 174, 0.35);
          transform: scale(1.05);
        }

        /* HAMBURGER */
        .menu-toggle {
          display: none;
          font-size: 1.8rem;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
        }

        /* ================= ADMIN SIDEBAR ================= */
        .admin-sidebar {
          width: 240px;
          height: 90vh;
          background: rgba(10, 10, 20, 0.95);
          backdrop-filter: blur(12px);
          padding: 30px 20px;
          box-shadow: 4px 0 20px rgba(0, 0, 0, 0.5);
          position: fixed;
          top: 0;
          left: 0;
          display: flex;
          flex-direction: column;
          transition: 0.3s ease;
          z-index: 1001;
        }

        .admin-sidebar .logo {
          margin-bottom: 40px;
        }

        .nav {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .admin-sidebar .nav-link {
          padding: 10px 15px;
          border-radius: 12px;
        }

        .admin-sidebar .nav-link:hover {
          background: rgba(219, 27, 174, 0.2);
          transform: translateX(5px);
        }

        .admin-sidebar .nav-link.active {
          color: #db1bae;
          background: rgba(219, 27, 174, 0.15);
          border-left: 4px solid #db1bae;
        }

        .admin-sidebar .logout-btn {
          margin-top: auto;
          border-radius: 12px;
        }

        /* ================= MOBILE ================= */
        @media (max-width: 768px) {

          .menu-toggle {
            display: block;
          }

          .links {
            position: absolute;
            top: 70px;
            right: 0;
            width: 220px;
            background: rgba(10, 10, 20, 0.95);
            flex-direction: column;
            align-items: flex-start;
            padding: 15px;
            gap: 10px;

            transform: translateX(100%);
            transition: 0.3s ease;
          }

          .links.open {
            transform: translateX(0);
          }

          .nav-link, .logout-btn {
            width: 100%;
          }

          /* ADMIN SIDEBAR MOBILE */
          .admin-sidebar {
            transform: translateX(-100%);
          }

          .admin-sidebar.open {
            transform: translateX(0);
          }

          .sidebar-toggle {
            position: fixed;
            top: 15px;
            left: 15px;
            font-size: 1.5rem;
            background: rgba(10,10,20,0.8);
            border: none;
            color: white;
            padding: 8px 12px;
            border-radius: 8px;
            z-index: 1100;
          }
        }
      `}</style>

      {/* ================= ADMIN VIEW ================= */}
      {role === "admin" ? (
        <>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>

          <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
            <h1 className="logo">Glow by Mae</h1>

            <nav className="nav">
              <NavLink to="/admin/dashboard" className="nav-link">
                📊 Dashboard
              </NavLink>

              <NavLink to="/admin/bookings" className="nav-link">
                📅 Bookings
              </NavLink>
            </nav>

            <button className="logout-btn" onClick={handleLogout}>
              🚪 Logout
            </button>
          </aside>
        </>
      ) : (
        /* ================= USER VIEW ================= */
        <nav className="user-navbar">
          <h1 className="logo">Glow by Mae</h1>

          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>

          <div className={`links ${menuOpen ? "open" : ""}`}>
            <NavLink to="/user/home" className="nav-link">
              🏠 Home
            </NavLink>

            <NavLink to="/services" className="nav-link">
              💇 Services
            </NavLink>

            <NavLink to="/user/notifications" className="nav-link">
              🔔 Notifications
            </NavLink>

            <button className="logout-btn" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </nav>
      )}
    </>
  );
}

export default Navbar;