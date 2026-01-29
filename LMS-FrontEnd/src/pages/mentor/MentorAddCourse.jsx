import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function MentorAddCourse() {
  const nav = useNavigate();
  const [categories, setCategories] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    categoryId: "",
    extraNote: ""
  });

  useEffect(() => {
    // We can use admin categories endpoint for dropdown
    api.get("/categories")
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.description.trim() || !form.categoryId) {
      return alert("Title, description and category are required.");
    }

    const fd = new FormData();
    fd.append("Title", form.title);
    fd.append("Description", form.description);
    fd.append("CategoryId", form.categoryId);
    fd.append("ExtraNote", form.extraNote);

    if (thumbnail) fd.append("thumbnail", thumbnail);

    await api.post("/mentor/courses", fd, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    alert("Course created ✅");
    nav("/mentor/courses");
  };

  return (
    <div>
      <nav className="navbar navbar-dark bg-dark px-3">
        <Link className="navbar-brand fw-bold" to="/mentor/courses">← Courses</Link>
      </nav>

      <div className="container py-4" style={{ maxWidth: 850 }}>
        <div className="card shadow-sm p-4">
          <h4 className="fw-bold">Add Course</h4>

          <form onSubmit={submit} className="mt-3">
            <div className="mb-3">
              <label className="form-label">Course Title</label>
              <input className="form-control" value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea className="form-control" rows="3" value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label">Category</label>
              <select className="form-select" value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                <option value="">-- Select --</option>
                {categories.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Thumbnail Upload</label>
              <input type="file" className="form-control" onChange={(e) => setThumbnail(e.target.files[0])} />
            </div>

            <div className="mb-3">
              <label className="form-label">Extra Note</label>
              <textarea className="form-control" rows="3" value={form.extraNote}
                onChange={(e) => setForm({ ...form, extraNote: e.target.value })}></textarea>
            </div>

            <button className="btn btn-dark w-100">Create Course</button>
          </form>
        </div>
      </div>
    </div>
  );
}
