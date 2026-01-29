import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { logout } from "../../services/auth";
import Loading from "../../components/Loading";

export default function MentorProfile() {
  const nav = useNavigate();
  const userId = localStorage.getItem("userId");

  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    address: "",
    bio: ""
  });

  const load = async () => {
    setLoading(true);
    const res = await api.get(`/users/${userId}`);
    setUser(res.data);

    setEdit({
      firstName: res.data.firstName || "",
      lastName: res.data.lastName || "",
      mobileNumber: res.data.mobileNumber || "",
      address: res.data.address || "",
      bio: res.data.bio || ""
    });

    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const update = async () => {
    await api.put(`/users/${userId}`, edit);
    alert("Profile updated ✅");
    load();
  };

  const handleLogout = () => {
    logout();
    nav("/");
  };

  if (loading) return <Loading text="Loading mentor profile..." />;

  return (
    <div>
      <nav className="navbar navbar-dark bg-dark px-3">
        <Link className="navbar-brand fw-bold" to="/mentor">
          Mentor
        </Link>
        <div className="ms-auto d-flex gap-2">
          <Link className="btn btn-outline-light" to="/mentor/courses">Courses</Link>
          <Link className="btn btn-outline-light" to="/mentor/enrolled">Enrolled</Link>
          <Link className="btn btn-outline-light" to="/mentor/profile">Profile</Link>
        </div>
      </nav>

      <div className="container py-4" style={{ maxWidth: 800 }}>
        <div className="card shadow-sm p-4">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h4 className="fw-bold mb-1">Mentor Profile</h4>
              <div className="text-muted">
                Role: <span className="badge bg-success">{user.role}</span>
              </div>
            </div>

            {/* Circular profile icon */}
            <div
              className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center"
              style={{ width: 60, height: 60, fontSize: 22 }}
              title="Profile Icon"
            >
              {user.firstName?.charAt(0)?.toUpperCase()}
            </div>
          </div>

          <hr />

          {/* Read-only */}
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Username (Read-only)</label>
              <input className="form-control" value={user.username} disabled />
            </div>

            <div className="col-md-6">
              <label className="form-label">Email (Read-only)</label>
              <input className="form-control" value={user.email} disabled />
            </div>

            <div className="col-md-6">
              <label className="form-label">Highest Education (Read-only)</label>
              <input className="form-control" value={user.highestEducation || "-"} disabled />
            </div>

            <div className="col-md-6">
              <label className="form-label">Mobile</label>
              <input
                className="form-control"
                value={edit.mobileNumber}
                onChange={(e) => setEdit({ ...edit, mobileNumber: e.target.value })}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">First Name</label>
              <input
                className="form-control"
                value={edit.firstName}
                onChange={(e) => setEdit({ ...edit, firstName: e.target.value })}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Last Name</label>
              <input
                className="form-control"
                value={edit.lastName}
                onChange={(e) => setEdit({ ...edit, lastName: e.target.value })}
              />
            </div>

            <div className="col-md-12">
              <label className="form-label">Address</label>
              <input
                className="form-control"
                value={edit.address}
                onChange={(e) => setEdit({ ...edit, address: e.target.value })}
              />
            </div>

            <div className="col-md-12">
              <label className="form-label">Bio</label>
              <textarea
                className="form-control"
                rows="3"
                value={edit.bio}
                onChange={(e) => setEdit({ ...edit, bio: e.target.value })}
              />
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
