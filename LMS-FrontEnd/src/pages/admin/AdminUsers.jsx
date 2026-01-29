import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Loading from "../../components/Loading";

export default function AdminUsers() {
  const [students, setStudents] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    // If you haven't created these endpoints yet, I will generate them for you.
    const s = await api.get("/admin/users/students");
    const m = await api.get("/admin/users/mentors");
    setStudents(s.data);
    setMentors(m.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const deleteUser = async (id) => {
    if (!confirm("Delete this user?")) return;
    await api.delete(`/admin/users/${id}`);
    load();
  };

  return (
    <div>
      <nav className="navbar navbar-dark bg-dark px-3">
        <Link className="navbar-brand fw-bold" to="/admin">Admin</Link>
        <div className="ms-auto d-flex gap-2">
          <Link className="btn btn-outline-light" to="/admin/categories">Category</Link>
          <Link className="btn btn-outline-light" to="/admin/users">Users</Link>
          <Link className="btn btn-outline-light" to="/admin/profile">Profile</Link>
        </div>
      </nav>

      <div className="container py-4">
        <h4 className="fw-bold mb-3">Users Management</h4>

        {loading ? <Loading /> : (
          <>
            <div className="card shadow-sm p-4 mb-4">
              <h5 className="fw-bold">Students</h5>
              <div className="table-responsive">
                <table className="table table-bordered table-hover mt-3">
                  <thead className="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Username</th>
                      <th>Mobile</th>
                      <th style={{ width: 120 }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((u) => (
                      <tr key={u.userId}>
                        <td>{u.userId}</td>
                        <td>{u.firstName} {u.lastName}</td>
                        <td>{u.email}</td>
                        <td>{u.username}</td>
                        <td>{u.mobileNumber}</td>
                        <td>
                          <button className="btn btn-sm btn-danger" onClick={() => deleteUser(u.userId)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {students.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center text-muted">No students found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card shadow-sm p-4">
              <h5 className="fw-bold">Mentors</h5>
              <div className="table-responsive">
                <table className="table table-bordered table-hover mt-3">
                  <thead className="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Username</th>
                      <th>Mobile</th>
                      <th style={{ width: 120 }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mentors.map((u) => (
                      <tr key={u.userId}>
                        <td>{u.userId}</td>
                        <td>{u.firstName} {u.lastName}</td>
                        <td>{u.email}</td>
                        <td>{u.username}</td>
                        <td>{u.mobileNumber}</td>
                        <td>
                          <button className="btn btn-sm btn-danger" onClick={() => deleteUser(u.userId)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {mentors.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center text-muted">No mentors found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
