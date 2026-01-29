import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Loading from "../../components/Loading";

export default function MentorEnrolled() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await api.get("/mentor/enrolled");
    setList(res.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

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

      <div className="container py-4">
        <h4 className="fw-bold mb-3">Students Enrolled in My Courses</h4>

        {loading ? (
          <Loading />
        ) : (
          <div className="card shadow-sm p-4">
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Enrollment ID</th>
                    <th>Course</th>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Enrolled At</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((x) => (
                    <tr key={x.enrollmentId}>
                      <td>{x.enrollmentId}</td>
                      <td>{x.courseTitle}</td>
                      <td>{x.studentName}</td>
                      <td>{x.studentEmail}</td>
                      <td>{x.studentMobile}</td>
                      <td>{new Date(x.enrolledAt).toLocaleString()}</td>
                    </tr>
                  ))}

                  {list.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center text-muted">
                        No enrollments found yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
