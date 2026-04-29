import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

import bgImage from "../../assets/salon-bg.jpg";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/home");
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      localStorage.setItem("token", user.accessToken);

      if (email === "admin@gmail.com") {
        localStorage.setItem("role", "admin");
        navigate("/admin/dashboard");
      } else {
        localStorage.setItem("role", "user");
        navigate("/user/home");
      }
    } catch (error) {
      console.log(error.code);

      switch (error.code) {
        case "auth/user-not-found":
          alert("No account found.");
          break;
        case "auth/wrong-password":
          alert("Incorrect password.");
          break;
        case "auth/invalid-email":
          alert("Invalid email.");
          break;
        default:
          alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div>

      <div style={styles.card}>
        <h1 style={styles.title}>Welcome Back</h1>
        <p style={styles.subtitle}>Login to Mae's Salon & Spa</p>

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <button
            type="submit"
            disabled={loading}
            style={styles.button}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    width: "100%",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    fontFamily: "Arial, sans-serif",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
  },

  card: {
    position: "relative",
    zIndex: 2,
    width: "350px",
    padding: "30px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(15px)",
    border: "1px solid rgba(255,255,255,0.2)",
    boxShadow: "0 8px 25px rgba(0,0,0,0.4)",
    textAlign: "center",
  },

  title: {
    color: "#fff",
    marginBottom: "5px",
  },

  subtitle: {
    color: "#ddd",
    fontSize: "14px",
    marginBottom: "20px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    fontSize: "14px",
  },

  button: {
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #ff69b4, #ff1493)",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s",
  },
};

export default Login;