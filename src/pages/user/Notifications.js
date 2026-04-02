import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import bgImage from "../../assets/salon-bg.jpg";

const API_URL = "http://localhost:5000/api/bookings";

function Notifications() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUserBookings();
  }, [token, navigate]);

  const fetchUserBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sorted = (res.data || []).sort(
        (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
      );
      setBookings(sorted);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError("Failed to load notifications. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return "#fbc02d";
      case "approved": return "#4caf50";
      case "rejected": return "#f44336";
      case "rescheduled": return "#2196f3";
      case "confirmed": return "#8e24aa";
      default: return "#9e9e9e";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return "⏳";
      case "approved": return "✅";
      case "rejected": return "❌";
      case "rescheduled": return "🔄";
      case "confirmed": return "✔️";
      default: return "📌";
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <h2 style={{ color: "#fff", zIndex: 1 }}>Loading notifications...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.backgroundImage} />
        <div style={styles.overlay} />
        <div style={styles.content}>
          <div style={styles.errorMessage}>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.backgroundImage} />
      <div style={styles.overlay} />
      <div style={styles.content}>
        <h2 style={styles.header}>Your Notifications</h2>

        {bookings.length === 0 ? (
          <p style={styles.empty}>No notifications yet. Book a service to get started!</p>
        ) : (
          <div style={styles.notificationList}>
            {bookings.map((booking) => (
              <div key={booking.id} style={styles.notificationCard}>
                <div style={styles.cardHeader}>
                  <span style={styles.serviceName}>{booking.service || booking.serviceName || "Service"}</span>
                  <span style={{ ...styles.statusBadge, backgroundColor: getStatusColor(booking.status) }}>
                    {getStatusIcon(booking.status)} {booking.status}
                  </span>
                </div>
                <div style={styles.cardBody}>
                  <p><strong>Date:</strong> {booking.date ? new Date(booking.date).toLocaleDateString() : "N/A"}</p>
                  <p><strong>Time:</strong> {booking.time || "N/A"}</p>
                  <p><strong>Last updated:</strong> {formatDate(booking.updatedAt || booking.createdAt)}</p>
                  {booking.status === "rescheduled" && (
                    <p style={styles.note}>⚠️ Your booking has been rescheduled. Please check the new date/time.</p>
                  )}
                  {booking.status === "approved" && (
                    <p style={styles.note}>✅ Your booking is confirmed! See you soon.</p>
                  )}
                  {booking.status === "rejected" && (
                    <p style={styles.note}>❌ Sorry, your booking could not be accommodated.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Poppins', sans-serif",
    minHeight: "100vh",
    position: "relative",
    paddingTop: "80px",
    paddingBottom: "30px",
    overflowX: "hidden",
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    zIndex: -2,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    backdropFilter: "blur(3px)",
    zIndex: -1,
  },
  content: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "20px",
    color: "#fff",
  },
  header: {
    textAlign: "center",
    fontSize: "2rem",
    fontWeight: 700,
    marginBottom: "25px",
    background: "linear-gradient(135deg, #ffca28, #ffb300)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  empty: {
    textAlign: "center",
    fontSize: "1.1rem",
    color: "#ccc",
  },
  notificationList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  notificationCard: {
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)",
    borderRadius: "16px",
    padding: "18px",
    border: "1px solid rgba(255,255,255,0.2)",
    boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: "12px",
  },
  serviceName: {
    fontSize: "1.2rem",
    fontWeight: 600,
    color: "#ffca28",
  },
  statusBadge: {
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "#fff",
    marginTop: "5px",
  },
  cardBody: {
    fontSize: "0.95rem",
    lineHeight: 1.5,
    color: "#f0f0f0",
  },
  note: {
    marginTop: "8px",
    padding: "8px",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: "6px",
    borderLeft: "4px solid #ffca28",
    fontStyle: "italic",
  },
  loadingContainer: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  errorMessage: {
    backgroundColor: "rgba(0,0,0,0.7)",
    color: "#ff6b6b",
    padding: "14px",
    borderRadius: "10px",
    textAlign: "center",
    fontSize: "1rem",
  },
};

export default Notifications;