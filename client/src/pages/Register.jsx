import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

import "../styles/global.css";
import "../styles/auth.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ================= REGISTER =================
  const registerUser = async (e) => {
    e.preventDefault();

    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await API.post("/auth/register", {
        name,
        email,
        password,
      });

      alert("Registered successfully");

      navigate("/");

    } catch (err) {

      console.log(err);

      alert(
        err.response?.data?.message ||
        "Register failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">

      <form
        className="auth-card"
        onSubmit={registerUser}
      >

        <h2>Create Account</h2>

        <p>
          Join Weather Dashboard
        </p>

        {/* NAME */}
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          autoComplete="name"
        />

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
          placeholder="Create Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          autoComplete="new-password"
        />

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Creating Account..."
            : "Register"}
        </button>

        {/* LOGIN LINK */}
        <p
          style={{
            marginTop: "12px",
            cursor: "pointer",
            textAlign: "center",
          }}
          onClick={() => navigate("/")}
        >
          Already have an account?
          <b> Login</b>
        </p>

      </form>

    </div>
  );
}

export default Register;
