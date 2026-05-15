import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

import "../styles/global.css";
import "../styles/auth.css";

function Register() {
  const [step, setStep] = useState(1); // 1 = details, 2 = otp
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();

  // ================= STEP 1: SEND OTP =================
  const sendOtp = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await API.post("/auth/send-otp", { email });

      alert("OTP sent to email");
      setStep(2);

    } catch (err) {
      alert(err.response?.data?.message || "OTP send failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= STEP 2: VERIFY OTP =================
  const verifyOtp = async (e) => {
    e.preventDefault();

    if (!otp) {
      alert("Enter OTP");
      return;
    }

    try {
      setLoading(true);

      await API.post("/auth/verify-register", {
        name,
        email,
        password,
        otp,
      });

      alert("Registered successfully");
      navigate("/");

    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">

      {/* ================= STEP 1 ================= */}
      {step === 1 && (
        <form className="auth-card" onSubmit={sendOtp}>

          <h2>Create Account</h2>
          <p>Step 1: Enter Details</p>

          <input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button disabled={loading}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>

        </form>
      )}

      {/* ================= STEP 2 ================= */}
      {step === 2 && (
        <form className="auth-card" onSubmit={verifyOtp}>

          <h2>Verify OTP</h2>
          <p>Enter OTP sent to your email</p>

          <input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button disabled={loading}>
            {loading ? "Verifying..." : "Verify & Register"}
          </button>

        </form>
      )}

    </div>
  );
}

export default Register;