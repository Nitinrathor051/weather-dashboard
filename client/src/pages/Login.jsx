import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

import "../styles/global.css";
import "../styles/auth.css";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ================= LOGIN =================
  const loginUser = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Please fill all fields");
      return;
    }

    try {

      setLoading(true);

      const res = await API.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      console.log(res.data);

      // SAVE TOKEN
      localStorage.setItem(
        "token",
        res.data.token
      );

      // SAVE USER
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      alert("Login successful");

      // REDIRECT
      window.location.href = "/dashboard";

    } catch (err) {

      console.log(err);

      alert(
        err.response?.data?.message ||
        "Login failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="auth-container">

      <form
        className="auth-card"
        onSubmit={loginUser}
      >

        <h2>Welcome Back</h2>

        <p>
          Login to continue to Weather Dashboard
        </p>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          autoComplete="email"
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          autoComplete="current-password"
        />

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>

        {/* REGISTER LINK */}
        <div
          style={{
            marginTop: "12px",
            textAlign: "center",
          }}
        >

          <p
            style={{
              cursor: "pointer",
            }}
            onClick={() =>
              navigate("/register")
            }
          >
            Don’t have an account?
            <b> Register</b>
          </p>

        </div>

      </form>

    </div>
  );
}

export default Login;
