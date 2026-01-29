import { useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [msg, setMsg] = useState("");

  const sendOtp = async () => {
    setMsg("");
    try {
      const res = await api.post("/auth/forgot-password", { email });
      alert("OTP Generated ✅ (Demo OTP in response): " + res.data.otp);
      setStep(2);
    } catch (err) {
      setMsg(err?.response?.data || "Failed");
    }
  };

  const verifyOtp = async () => {
    setMsg("");
    try {
      await api.post("/auth/verify-otp", { email, otp });
      setStep(3);
    } catch (err) {
      setMsg(err?.response?.data || "OTP verify failed");
    }
  };

  const resetPassword = async () => {
    setMsg("");
    try {
      await api.post("/auth/reset-password", { email, newPassword: newPass });
      alert("Password reset successful ✅");
      setStep(1);
    } catch (err) {
      setMsg(err?.response?.data || "Reset failed");
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 520 }}>
      <div className="card shadow-sm p-4">
        <h3 className="fw-bold">Forgot Password</h3>

        {msg && <div className="alert alert-danger">{msg}</div>}

        {step === 1 && (
          <>
            <label className="form-label mt-3">Email</label>
            <input className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button className="btn btn-dark w-100 mt-3" onClick={sendOtp}>Send OTP</button>
          </>
        )}

        {step === 2 && (
          <>
            <label className="form-label mt-3">Enter OTP</label>
            <input className="form-control" value={otp} onChange={(e) => setOtp(e.target.value)} />
            <button className="btn btn-warning w-100 mt-3" onClick={verifyOtp}>Verify OTP</button>
          </>
        )}

        {step === 3 && (
          <>
            <label className="form-label mt-3">New Password</label>
            <input className="form-control" value={newPass} onChange={(e) => setNewPass(e.target.value)} />
            <button className="btn btn-success w-100 mt-3" onClick={resetPassword}>Reset Password</button>
          </>
        )}

        <div className="text-center mt-3">
          <Link to="/login" className="text-decoration-none">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
