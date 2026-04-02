import React, { useEffect, useState } from "react";
import axios from "axios";
import bgImage from "../../assets/salon-bg.jpg";

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const API_URL = "http://localhost:5000/api/bookings";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    axios
      .get(API_URL, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setBookings(res.data))
      .catch((err) => console.error(err));
  }, []);

  const pendingCount = bookings.filter(b => b.status.toLowerCase() === "pending").length;
  const approvedCount = bookings.filter(b => b.status.toLowerCase() === "approved").length;
  const rejectedCount = bookings.filter(b => b.status.toLowerCase() === "rejected").length;
  const rescheduledCount = bookings.filter(b => b.status.toLowerCase() === "rescheduled").length;

  const cardData = [
    { title: "Pending", count: pendingCount, icon: "📅", color: "rgba(251, 192, 45, 0.25)" },
    { title: "Approved", count: approvedCount, icon: "✅", color: "rgba(76, 175, 80, 0.25)" },
    { title: "Rescheduled", count: rescheduledCount, icon: "🔄", color: "rgba(33, 150, 243, 0.25)" },
    { title: "Rejected", count: rejectedCount, icon: "❌", color: "rgba(244, 67, 54, 0.25)" },
  ];

  return (
    <div className="dashboard-wrapper">
      {/* Background */}
      <div className="bg-image" style={{ backgroundImage: `url(${bgImage})` }} />
      <div className="overlay" />

      {/* Main content */}
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h2>Booking Summary</h2>
          <div className="header-underline" />
        </header>

        <div className="card-grid">
          {cardData.map((card) => (
            <div key={card.title} className="card" style={{ background: `linear-gradient(145deg, ${card.color}, rgba(255,255,255,0.05))` }}>
              <div className="card-icon">{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.count}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        /* Wrapper and background */
        .dashboard-wrapper {
          font-family: 'Poppins', sans-serif;
          min-height: 100vh;
          position: relative;
          color: #fff;
        }

        .bg-image {
          position: fixed;
          top: 0;
          left: 260px;
          width: calc(100% - 260px);
          height: 100%;
          background-size: cover;
          background-position: center;
          z-index: -2;
        }

        .overlay {
          position: fixed;
          top: 0;
          left: 260px;
          width: calc(100% - 260px);
          height: 100%;
          background-color: rgba(0,0,0,0.6);
          backdrop-filter: blur(3px);
          z-index: -1;
        }

        @media (max-width: 768px) {
          .bg-image, .overlay {
            left: 0;
            width: 100%;
          }
        }

        /* Main container */
        .dashboard-container {
          margin-left: 260px;
          padding: 30px 20px;
          animation: fadeIn 0.8s ease-out;
        }

        @media (max-width: 768px) {
          .dashboard-container {
            margin-left: 0;
            padding: 20px 15px;
          }
        }

        /* Header */
        .dashboard-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .dashboard-header h2 {
          font-size: 2.5rem;
          font-weight: 700;
          letter-spacing: 1px;
          margin-bottom: 10px;
          background: linear-gradient(135deg, #ffca28, #ffb300);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 2px 10px rgba(255, 202, 40, 0.3);
        }

        .header-underline {
          width: 80px;
          height: 4px;
          background: linear-gradient(90deg, #ffca28, #ffb300);
          margin: 0 auto 20px;
          border-radius: 2px;
        }

        /* Cards grid */
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

        /* Individual card */
        .card {
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 20px 15px;
          text-align: center;
          border: 1px solid rgba(255,255,255,0.2);
          box-shadow: 0 12px 25px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1) inset;
          transition: all 0.3s ease;
          cursor: pointer;
          color: #fff;
        }

        .card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 20px 35px rgba(0,0,0,0.6), 0 0 0 2px rgba(255,255,255,0.2) inset;
        }

        .card-icon {
          font-size: 2.2rem;
          margin-bottom: 10px;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));
        }

        .card h3 {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 8px;
          letter-spacing: 0.5px;
          text-shadow: 0 2px 5px rgba(0,0,0,0.3);
        }

        .card p {
          font-size: 2.2rem;
          font-weight: 700;
          margin: 0;
          line-height: 1;
          text-shadow: 0 4px 8px rgba(0,0,0,0.4);
        }

        /* Animation */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;