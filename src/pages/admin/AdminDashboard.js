import React, { useEffect, useState } from "react";
import axios from "axios";
import bgImage from "../../assets/salon-bg.jpg";

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const API_URL = "http://localhost:5000/api/bookings";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchBookings = () => {
      axios
        .get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setBookings(res.data || []);
        })
        .catch((err) => console.error("Fetch error:", err));
    };

    fetchBookings();

    // 🔥 auto refresh every 3 seconds so counts update instantly
    const interval = setInterval(fetchBookings, 3000);

    return () => clearInterval(interval);
  }, []);

  // ✅ SAFE STATUS HANDLER
  const getStatus = (b) => (b?.status || "pending").toLowerCase();

  const pendingCount = bookings.filter(
    (b) => getStatus(b) === "pending"
  ).length;

  const approvedCount = bookings.filter(
    (b) => getStatus(b) === "approved"
  ).length;

  const rejectedCount = bookings.filter(
    (b) => getStatus(b) === "rejected"
  ).length;

  const rescheduledCount = bookings.filter(
    (b) => getStatus(b) === "rescheduled"
  ).length;

  const cardData = [
    {
      title: "Pending",
      count: pendingCount,
      icon: "📅",
      color: "rgba(251, 192, 45, 0.25)",
    },
    {
      title: "Approved",
      count: approvedCount,
      icon: "✅",
      color: "rgba(76, 175, 80, 0.25)",
    },
    {
      title: "Rescheduled",
      count: rescheduledCount,
      icon: "🔄",
      color: "rgba(33, 150, 243, 0.25)",
    },
    {
      title: "Rejected",
      count: rejectedCount,
      icon: "❌",
      color: "rgba(244, 67, 54, 0.25)",
    },
  ];

  return (
    <div className="dashboard-wrapper">
      {/* Background */}
      <div
        className="bg-image"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="overlay" />

      {/* Main content */}
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h2>Booking Summary</h2>
          <div className="header-underline" />
        </header>

        <div className="card-grid">
          {cardData.map((card) => (
            <div
              key={card.title}
              className="card"
              style={{
                background: `linear-gradient(145deg, ${card.color}, rgba(255,255,255,0.05))`,
              }}
            >
              <div className="card-icon">{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FIXED STYLES */}
      <style>{`
        .dashboard-wrapper {
          font-family: 'Poppins', sans-serif;
          min-height: 100vh;
          position: relative;
          color: #fff;
        }

        /* FIXED SIDEBAR ALIGNMENT */
        .bg-image,
        .overlay {
          position: fixed;
          top: 0;
          left: 260px;
          width: calc(100% - 260px);
          height: 100%;
        }

        .bg-image {
          background-size: cover;
          background-position: center;
          z-index: -2;
        }

        .overlay {
          background-color: rgba(0,0,0,0.6);
          backdrop-filter: blur(3px);
          z-index: -1;
        }

        /* MAIN CONTENT FIX */
        .dashboard-container {
          margin-left: 260px;
          padding: 30px 20px;
          width: calc(100% - 260px);
          box-sizing: border-box;
        }

        /* HEADER */
        .dashboard-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .dashboard-header h2 {
          font-size: 2.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #ffca28, #ffb300);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .header-underline {
          width: 80px;
          height: 4px;
          background: linear-gradient(90deg, #ffca28, #ffb300);
          margin: 10px auto 20px;
          border-radius: 2px;
        }

        /* CARDS */
        .card-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          max-width: 800px;
          margin: 0 auto;
        }

        @media (max-width: 600px) {
          .card-grid {
            grid-template-columns: 1fr;
          }
        }

        .card {
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 20px 15px;
          text-align: center;
          border: 1px solid rgba(255,255,255,0.2);
          box-shadow: 0 12px 25px rgba(0,0,0,0.5);
          transition: 0.3s;
        }

        .card:hover {
          transform: translateY(-5px);
        }

        .card-icon {
          font-size: 2.2rem;
          margin-bottom: 10px;
        }

        .card h3 {
          font-size: 1.3rem;
          margin-bottom: 8px;
        }

        .card p {
          font-size: 2.2rem;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;