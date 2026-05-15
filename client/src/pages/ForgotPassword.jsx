import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

import "../styles/global.css";
import "../styles/auth.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ================= SEND OTP =================
  const sendOtp = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("Enter email");
      return;
    }

    try {
      setLoading(true);

      await API.post("/auth/send-reset-otp", { email });

      alert("OTP sent to email");
      setStep(2);

    } catch (err) {
      alert(err.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  // ================= RESET PASSWORD =================
  const resetPassword = async (e) => {
    e.preventDefault();

    if (!otp.trim() || !newPassword.trim()) {
      alert("Fill all fields");
      return;
    }

    try {
      setLoading(true);

      await API.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      alert("Password updated successfully");

      navigate("/");

    } catch (err) {
      alert(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">

      {/* STEP 1 */}
      {step === 1 && (
        <form className="auth-card" onSubmit={sendOtp}>
          <h2>Forgot Password</h2>
          <p>Enter your email</p>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button disabled={loading}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <form className="auth-card" onSubmit={resetPassword}>
          <h2>Reset Password</h2>
          <p>Enter OTP & new password</p>

          <input
            type="text"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button disabled={loading}>
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      )}

    </div>
  );
}

export default ForgotPassword;