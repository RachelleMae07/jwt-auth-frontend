import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role")?.toLowerCase();

  const [menuOpen, setMenuOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false); // ✅ NEW

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <style>{`
        /* =========================
           USER NAVBAR
        ========================== */

        .user-navbar {
          padding: 12px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(10, 10, 20, 0.85);
          backdrop-filter: blur(12px);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .logo {
          font-family: "Pacifico", cursive;
          font-size: 2rem;
          color: #db1bae;
        }

        .links {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .nav-link {
          padding: 8px 16px;
          color: #f0f0f0;
          text-decoration: none;
          border-radius: 30px;
        }

        .nav-link.active {
          color: #db1bae;
        }

        .logout-btn {
          padding: 8px 20px;
          border-radius: 30px;
          background: rgba(219, 27, 174, 0.2);
          color: #fff;
          border: none;
          cursor: pointer;
        }

        .menu-toggle {
          display: none;
          font-size: 26px;
          background: none;
          color: white;
          border: none;
        }

        @media (max-width: 768px) {
          .menu-toggle {
            display: block;
          }

          .links {
            position: absolute;
            top: 70px;
            right: 0;
            width: 220px;
            flex-direction: column;
            background: rgba(10,10,20,0.95);
            padding: 15px;
            transform: translateX(100%);
            transition: 0.3s ease;
          }

          .links.open {
            transform: translateX(0);
          }
        }

        /* =========================
           ADMIN SIDEBAR (FIXED MOBILE)
        ========================== */

        .admin-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 240px;
          background: rgba(10, 10, 20, 0.95);
          backdrop-filter: blur(12px);
          display: flex;
          flex-direction: column;
          padding: 20px;
          gap: 15px;
          transition: 0.3s ease;
          z-index: 1000;
        }

        .admin-sidebar .logo {
          font-size: 1.5rem;
          color: #db1bae;
          margin-bottom: 20px;
        }

        .admin-sidebar .nav-link {
          padding: 10px;
          color: #fff;
          border-radius: 8px;
        }

        .admin-sidebar .nav-link.active {
          background: #db1bae;
        }

        .admin-sidebar .logout-btn {
          margin-top: auto;
          padding: 10px;
          border-radius: 10px;
          background: rgba(219, 27, 174, 0.2);
          color: #fff;
          border: none;
          cursor: pointer;
        }

        /* =========================
           MOBILE ADMIN FIX
        ========================== */

        .admin-toggle {
          display: none;
          position: fixed;
          top: 15px;
          left: 15px;
          z-index: 1100;
          font-size: 28px;
          background: rgba(0,0,0,0.5);
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 5px 10px;
        }

        .overlay {
          display: none;
        }

        @media (max-width: 768px) {
          .admin-sidebar {
            transform: translateX(-100%);
          }

          .admin-sidebar.open {
            transform: translateX(0);
          }

          .admin-toggle {
            display: block;
          }

          .overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            z-index: 900;
          }
        }
      `}</style>

      {/* =========================
          ADMIN VIEW
      ========================== */}
      {role === "admin" ? (
        <>
          {/* hamburger */}
          <button
            className="admin-toggle"
            onClick={() => setAdminOpen(!adminOpen)}
          >
            ☰
          </button>

          {/* overlay */}
          {adminOpen && (
            <div
              className="overlay"
              onClick={() => setAdminOpen(false)}
            />
          )}

          <aside className={`admin-sidebar ${adminOpen ? "open" : ""}`}>
            <h1 className="logo">Glow by Mae</h1>

            <NavLink to="/admin/dashboard" className="nav-link" onClick={() => setAdminOpen(false)}>
              Dashboard
            </NavLink>

            <NavLink to="/admin/bookings" className="nav-link" onClick={() => setAdminOpen(false)}>
              Bookings
            </NavLink>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </aside>
        </>
      ) : (
        /* =========================
            USER NAVBAR
        ========================== */
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

            <NavLink to="/user/services" className="nav-link">
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