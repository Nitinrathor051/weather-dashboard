import { useState } from "react";
import API from "../services/api";
import { setToken } from "../services/auth";
import { useNavigate } from "react-router-dom";

import "../styles/global.css";
import "../styles/auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      setToken(res.data.token);

      navigate("/dashboard");

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">

      <form className="auth-card" onSubmit={loginUser}>

        <h2>Welcome Back</h2>
        <p>Login to continue to Weather Dashboard</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* LINKS */}
        <div style={{ marginTop: "12px", textAlign: "center" }}>

          <p
            style={{ cursor: "pointer", color: "blue" }}
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </p>

          <p
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/register")}
          >
            Don’t have an account? <b>Register</b>
          </p>

        </div>

      </form>

    </div>
  );
}

export default Login;