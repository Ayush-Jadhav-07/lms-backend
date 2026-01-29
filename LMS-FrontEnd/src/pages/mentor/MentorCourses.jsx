import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Loading from "../../components/Loading";

const BACKEND_BASE = "https://localhost:7015";

export default function MentorCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await api.get("/mentor/courses/my");
    setCourses(res.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <nav className="navbar navbar-dark bg-dark px-3">
        <Link className="navbar-brand fw-bold" to="/mentor">Mentor</Link>
        <div className="ms-auto d-flex gap-2">
          <Link className="btn btn-warning" to="/mentor/add-course">+ Add Course</Link>
          <Link className="btn btn-outline-light" to="/mentor/profile">Profile</Link>
        </div>
      </nav>

      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold mb-0">My Courses</h4>
          <span className="text-muted">Total: {courses.length}</span>
        </div>

        {loading ? <Loading /> : (
          <div className="row g-4">
            {courses.map((c) => (
              <div className="col-md-4" key={c.courseId}>
                <div className="card shadow-sm h-100">
                  <img
                    src={c.thumbnailUrl ? BACKEND_BASE + c.thumbnailUrl : "https://via.placeholder.com/400x220?text=Course+Thumbnail"}
                    className="card-img-top"
                    style={{ height: 200, objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="fw-bold">{c.title}</h5>
                    <p className="text-muted" style={{ minHeight: 60 }}>
                      {c.description.slice(0, 90)}...
                    </p>

                    <Link className="btn btn-dark w-100" to={`/mentor/course/${c.courseId}`}>
                      View Course
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {courses.length === 0 && (
              <div className="text-center text-muted py-5">
                No courses found. Click "Add Course" to create your first course.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
