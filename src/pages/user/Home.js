import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../../assets/salon-bg.jpg";

function Home() {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 150);
  }, []);

  return (
    <div
      style={{
        minHeight: "calc(100vh - 80px)",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.35))",
        }}
      />

      {/* Glass Container */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "900px",
          width: "100%",
          padding: "56px 36px",
          borderRadius: "30px",
          textAlign: "center",
          background: "rgba(255,255,255,0.18)",
          backdropFilter: "blur(14px)",
          border: "1px solid rgba(255,255,255,0.3)",
        }}
      >
        <h1
          style={{
            color: "#fff",
            fontSize: "clamp(28px, 4vw, 42px)",
            marginBottom: "16px",
            opacity: animate ? 1 : 0,
            transform: animate ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s ease",
          }}
        >
          Welcome to Mae's Salon & Spa
        </h1>

        <h5
          style={{
            color: "#f3f3f3",
            fontSize: "clamp(15px, 2.2vw, 18px)",
            marginBottom: "48px",
            lineHeight: 1.6,
            opacity: animate ? 1 : 0,
            transform: animate ? "translateY(0)" : "translateY(25px)",
            transition: "all 0.9s ease 0.15s",
          }}
        >
          Premium salon & spa services designed to help you look and feel your best.
        </h5>

        <div
          style={{
            display: "flex",
            gap: "18px",
            justifyContent: "center",
            flexWrap: "wrap",
            opacity: animate ? 1 : 0,
            transform: animate ? "translateY(0)" : "translateY(30px)",
            transition: "all 1s ease 0.3s",
          }}
        >
          <button
            onClick={() => navigate("/services")} // direct navigation
            style={{
              padding: "14px 46px",
              borderRadius: "999px",
              border: "none",
              background: "linear-gradient(135deg, #ff69b4, #ff1493)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "16px",
              cursor: "pointer",
              boxShadow: "0 10px 25px rgba(255,105,180,0.5)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            View Services
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;