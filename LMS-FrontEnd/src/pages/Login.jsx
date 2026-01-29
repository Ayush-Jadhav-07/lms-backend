import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { saveAuth } from "../services/auth";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "", remember: false });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await api.post("/auth/login", {
        username: form.username,
        password: form.password
      });

      saveAuth(res.data);

      if (res.data.role === "Admin") navigate("/admin");
      else if (res.data.role === "Mentor") navigate("/mentor");
      else navigate("/student");

    } catch (err) {
      setMsg(err?.response?.data || "Login failed");
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 520 }}>
      <div className="card shadow-sm p-4">
        <h3 className="fw-bold">Login</h3>
        <p className="text-muted">Enter your username & password</p>

        {msg && <div className="alert alert-danger">{msg}</div>}

        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input className="form-control" name="username" value={form.username} onChange={handleChange} required />
          </div>

          <div className="mb-2">
            <label className="form-label">Password</label>
            <input className="form-control" type="password" name="password" value={form.password} onChange={handleChange} required />
          </div>

          <div className="d-flex justify-content-between align-items-center my-3">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" name="remember" checked={form.remember} onChange={handleChange} />
              <label className="form-check-label">Remember Me</label>
            </div>

            <Link to="/forgot-password" className="text-decoration-none">Forgot password?</Link>
          </div>

          <button className="btn btn-dark w-100">Login</button>

          <div className="text-center mt-3">
            <span className="text-muted">New user? </span>
            <Link to="/register" className="text-decoration-none">Register</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
    