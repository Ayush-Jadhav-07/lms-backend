import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Loading from "../../components/Loading";

export default function StudentMyCourses() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await api.get("/student/courses/my");
    setList(res.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <nav className="navbar navbar-dark bg-dark px-3">
        <Link className="navbar-brand fw-bold" to="/student">Student</Link>
        <div className="ms-auto d-flex gap-2">
          <Link className="btn btn-outline-light" to="/student/profile">Profile</Link>
        </div>
      </nav>

      <div className="container py-4">
        <h4 className="fw-bold mb-3">My Courses</h4>

        {loading ? <Loading /> : (
          <div className="row g-3">
            {list.map((c) => (
              <div className="col-md-4" key={c.courseId}>
                <div className="card shadow-sm p-3 h-100">
                  <h5 className="fw-bold">{c.title}</h5>
                  <p className="text-muted">{c.description.slice(0, 100)}...</p>
                  <Link className="btn btn-dark mt-auto" to={`/student/course/${c.courseId}`}>
                    Open
                  </Link>
                </div>
              </div>
            ))}
            {list.length === 0 && (
              <div className="text-center text-muted py-5">
                You have not enrolled in any course.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
