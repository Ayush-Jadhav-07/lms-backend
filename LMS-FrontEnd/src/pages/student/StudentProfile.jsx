import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { logout } from "../../services/auth";

export default function StudentProfile() {
  const nav = useNavigate();
  const userId = localStorage.getItem("userId");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    address: "",
    bio: ""
  });

  useEffect(() => {
    api.get(`/users/${userId}`).then((res) => {
      setForm({
        firstName: res.data.firstName || "",
        lastName: res.data.lastName || "",
        mobileNumber: res.data.mobileNumber || "",
        address: res.data.address || "",
        bio: res.data.bio || ""
      });
    });
  }, []);

  const update = async () => {
    await api.put(`/users/${userId}`, form);
    alert("Profile Updated ✅");
  };

  const handleLogout = () => {
    logout();
    nav("/");
  };

  return (
    <div>
      <nav className="navbar navbar-dark bg-dark px-3">
        <Link className="navbar-brand fw-bold" to="/student">Student</Link>
        <div className="ms-auto d-flex gap-2">
          <Link className="btn btn-outline-light" to="/student/mycourses">MyCourses</Link>
        </div>
      </nav>

      <div className="container py-4" style={{ maxWidth: 700 }}>
        <div className="card shadow-sm p-4">
          <h4 className="fw-bold">Student Profile</h4>

          <div className="row g-3 mt-1">
            <div className="col-md-6">
              <label className="form-label">First Name</label>
              <input className="form-control" value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            </div>

            <div className="col-md-6">
              <label className="form-label">Last Name</label>
              <input className="form-control" value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            </div>

            <div className="col-md-6">
              <label className="form-label">Mobile</label>
              <input className="form-control" value={form.mobileNumber}
                onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })} />
            </div>

            <div className="col-md-6">
              <label className="form-label">Address</label>
              <input className="form-control" value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>

            <div className="col-md-12">
              <label className="form-label">Bio</label>
              <textarea className="form-control" rows="3" value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })} />
            </div>
          </div>

          <button className="btn btn-dark w-100 mt-4" onClick={update}>
            Save Changes
          </button>

          <button className="btn btn-warning w-100 mt-2" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
