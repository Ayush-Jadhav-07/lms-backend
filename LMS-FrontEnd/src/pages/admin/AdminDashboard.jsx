import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../services/auth";

export default function AdminDashboard() {
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav("/");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
        <Link className="navbar-brand fw-bold" to="/admin">Admin Panel</Link>

        <div className="ms-auto d-flex gap-2">
          <Link className="btn btn-outline-light" to="/admin/categories">Category</Link>
          <Link className="btn btn-outline-light" to="/admin/users">Users</Link>
          <Link className="btn btn-outline-light" to="/admin/profile">Profile</Link>
          <button className="btn btn-warning" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="container py-4">
        <div className="row g-3">
          <div className="col-md-4">
            <div className="card shadow-sm p-4">
              <h5 className="fw-bold">Category Management</h5>
              <p className="text-muted mb-0">
                Add / Update / Delete categories.
              </p>
              <Link className="btn btn-dark mt-3" to="/admin/categories">Open</Link>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm p-4">
              <h5 className="fw-bold">Users</h5>
              <p className="text-muted mb-0">
                View & manage Students and Mentors.
              </p>
              <Link className="btn btn-dark mt-3" to="/admin/users">Open</Link>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm p-4">
              <h5 className="fw-bold">Profile</h5>
              <p className="text-muted mb-0">
                Update Admin profile details.
              </p>
              <Link className="btn btn-dark mt-3" to="/admin/profile">Open</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
