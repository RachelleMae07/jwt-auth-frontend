import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import bgImage from "../../assets/salon-bg.jpg";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Username and password are required");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      if (res.data.role === "admin") navigate("/admin/dashboard");
      else navigate("/user/home");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay} />
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back</h2>

        {error && <div style={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleLogin} style={styles.form}>
          {/* Username field with icon */}
          <div style={styles.inputWrapper}>
            <span style={styles.inputIcon}>👤</span>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              disabled={loading}
              required
            />
          </div>

          {/* Password field with show/hide toggle */}
          <div style={styles.inputWrapper}>
            <span style={styles.inputIcon}>🔒</span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              disabled={loading}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={styles.toggleBtn}
              aria-label={showPassword ? "Hide password" : "Show password"}
              disabled={loading}
            >
              {showPassword ? "👁️‍🗨️" : "👁️"}
            </button>
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? (
              <>
                <span style={styles.spinner}></span> Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    fontFamily: "'Poppins', 'Segoe UI', 'Roboto', sans-serif",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  card: {
    position: "relative",
    zIndex: 1,
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(12px)",
    padding: "40px 32px",
    borderRadius: "32px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 25px 45px -12px rgba(0, 0, 0, 0.25)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  title: {
    margin: "0 0 24px 0",
    fontSize: "32px",
    fontWeight: "700",
    textAlign: "center",
    background: "linear-gradient(135deg, #ff69b4, #ff85c0)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    letterSpacing: "-0.5px",
  },
  errorMessage: {
    backgroundColor: "#ffe6e6",
    color: "#d9534f",
    padding: "12px 16px",
    borderRadius: "16px",
    fontSize: "14px",
    marginBottom: "20px",
    borderLeft: "4px solid #d9534f",
    animation: "shake 0.3s ease",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputWrapper: {
    position: "relative",
    width: "100%",
  },
  inputIcon: {
    position: "absolute",
    left: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "18px",
    color: "#ff69b4",
    pointerEvents: "none",
  },
  input: {
    width: "100%",
    padding: "14px 16px 14px 44px",
    fontSize: "15px",
    border: "1px solid rgba(0, 0, 0, 0.1)",
    borderRadius: "16px",
    outline: "none",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    boxSizing: "border-box",
  },
  toggleBtn: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "20px",
    padding: "4px",
    color: "#64748b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    transition: "color 0.2s",
  },
  button: {
    padding: "14px",
    fontSize: "16px",
    fontWeight: "600",
    background: "linear-gradient(135deg, #ff69b4, #ff85c0)",
    color: "white",
    border: "none",
    borderRadius: "40px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    marginTop: "8px",
    fontFamily: "inherit",
    letterSpacing: "0.5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  spinner: {
    width: "18px",
    height: "18px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "50%",
    borderTopColor: "white",
    display: "inline-block",
    animation: "spin 0.8s linear infinite",
  },
};

// Inject keyframes and global styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .login-input:focus {
      border-color: #ff69b4;
      box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.2);
    }
    button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    .login-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 35px 50px -15px rgba(0, 0, 0, 0.3);
    }
  `;
  document.head.appendChild(styleSheet);
}

export default Login;