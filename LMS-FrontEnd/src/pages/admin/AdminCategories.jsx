import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Loading from "../../components/Loading";

export default function AdminCategories() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({ name: "", description: "" });
  const [editId, setEditId] = useState(null);

  const load = async () => {
    setLoading(true);
    const res = await api.get("/admin/categories");
    setList(res.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return alert("Category name required");

    if (editId) {
      await api.put(`/admin/categories/${editId}`, form);
      setEditId(null);
    } else {
      await api.post("/admin/categories", form);
    }

    setForm({ name: "", description: "" });
    load();
  };

  const onEdit = (c) => {
    setEditId(c.categoryId);
    setForm({ name: c.name, description: c.description || "" });
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this category?")) return;
    await api.delete(`/admin/categories/${id}`);
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
        <div className="row g-4">
          <div className="col-md-5">
            <div className="card shadow-sm p-4">
              <h5 className="fw-bold">{editId ? "Edit Category" : "Add Category"}</h5>
              <form onSubmit={submit}>
                <div className="mb-3">
                  <label className="form-label">Category Name</label>
                  <input
                    className="form-control"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <button className="btn btn-dark w-100">
                  {editId ? "Update Category" : "Add Category"}
                </button>
              </form>
            </div>
          </div>

          <div className="col-md-7">
            <div className="card shadow-sm p-4">
              <h5 className="fw-bold">Category List</h5>

              {loading ? <Loading /> : (
                <div className="table-responsive">
                  <table className="table table-bordered table-hover mt-3">
                    <thead className="table-dark">
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th style={{ width: 160 }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.map((c) => (
                        <tr key={c.categoryId}>
                          <td>{c.categoryId}</td>
                          <td>{c.name}</td>
                          <td>{c.description}</td>
                          <td>
                            <button className="btn btn-sm btn-warning me-2" onClick={() => onEdit(c)}>
                              Edit
                            </button>
                            <button className="btn btn-sm btn-danger" onClick={() => onDelete(c.categoryId)}>
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                      {list.length === 0 && (
                        <tr>
                          <td colSpan="4" className="text-center text-muted">No categories found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
