import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../services/auth";

export default function MentorDashboard() {
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav("/");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
        <Link className="navbar-brand fw-bold" to="/mentor">Mentor Panel</Link>

        <div className="ms-auto d-flex gap-2">
          <Link className="btn btn-outline-light" to="/mentor/courses">Courses</Link>
          <Link className="btn btn-outline-light" to="/mentor/enrolled">Enrolled</Link>
          <Link className="btn btn-outline-light" to="/mentor/profile">Profile</Link>
          <button className="btn btn-warning" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="container py-4">
        <div className="row g-3">
          <div className="col-md-6">
            <div className="card shadow-sm p-4">
              <h5 className="fw-bold">Manage Courses</h5>
              <p className="text-muted mb-0">Add courses, upload materials, create topics.</p>
              <Link className="btn btn-dark mt-3" to="/mentor/courses">Open</Link>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow-sm p-4">
              <h5 className="fw-bold">Students Enrolled</h5>
              <p className="text-muted mb-0">View enrolled students in your courses.</p>
              <Link className="btn btn-dark mt-3" to="/mentor/enrolled">Open</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
