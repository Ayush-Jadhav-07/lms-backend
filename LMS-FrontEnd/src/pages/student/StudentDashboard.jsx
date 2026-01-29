import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Loading from "../../components/Loading";

const BACKEND_BASE = "https://localhost:7015";

export default function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await api.get(`/student/courses?search=${search}`);
    setCourses(res.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <nav className="navbar navbar-dark bg-dark px-3">
        <Link className="navbar-brand fw-bold" to="/student">Student</Link>
        <div className="ms-auto d-flex gap-2">
          <Link className="btn btn-outline-light" to="/student/mycourses">MyCourses</Link>
          <Link className="btn btn-outline-light" to="/student/profile">Profile</Link>
        </div>
      </nav>

      <div className="container py-4">
        <div className="d-flex gap-2">
          <input
            className="form-control"
            placeholder="Search course by title/description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-dark" onClick={load}>Search</button>
        </div>

        <h4 className="fw-bold mt-4 mb-3">Available Courses</h4>

        {loading ? <Loading /> : (
          <div className="row g-4">
            {courses.map((c) => (
              <div className="col-md-4" key={c.courseId}>
                <div className="card shadow-sm h-100">
                  <img
                    src={c.thumbnailUrl ? BACKEND_BASE + c.thumbnailUrl : "https://via.placeholder.com/400x220?text=Course"}
                    className="card-img-top"
                    style={{ height: 200, objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="fw-bold">{c.title}</h5>
                    <p className="text-muted">{c.description.slice(0, 90)}...</p>

                    <Link className="btn btn-dark w-100" to={`/student/course/${c.courseId}`}>
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            {courses.length === 0 && (
              <div className="text-center text-muted py-5">
                No courses found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
