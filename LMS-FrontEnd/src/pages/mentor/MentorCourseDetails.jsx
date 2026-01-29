import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";
import Loading from "../../components/Loading";

const BACKEND_BASE = "https://localhost:7015";

export default function MentorCourseDetails() {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Add Section Form
  const [sectionForm, setSectionForm] = useState({
    courseId: id,
    sectionName: "",
    sectionDescription: "",
  });

  // ✅ Add Topic Form
  const [topicForm, setTopicForm] = useState({
    sectionId: "",
    topicName: "",
    topicDescription: "",
  });

  // ✅ Upload Material Form
  const [materialForm, setMaterialForm] = useState({
    topicId: "",
    materialType: 1, // 1 Video, 2 PDF, 3 PPT, 4 Link file
    title: "",
  });
  const [materialFile, setMaterialFile] = useState(null);

  // ✅ Assignments
  const [assignmentForm, setAssignmentForm] = useState({
    courseId: id,
    title: "",
    description: "",
    dueDate: "",
  });
  const [assignments, setAssignments] = useState([]);

  const load = async () => {
    setLoading(true);

    // ✅ Course + Content
    const res = await api.get(`/mentor/course-content/${id}`);
    setData(res.data);

    // ✅ Assignments list
    try {
      const a = await api.get(`/mentor/assignments/course/${id}`);
      setAssignments(a.data);
    } catch (err) {
      setAssignments([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  // ✅ Add Section
  const addSection = async (e) => {
    e.preventDefault();

    if (!sectionForm.sectionName.trim()) {
      return alert("Section name is required");
    }

    await api.post("/mentor/content/sections", {
      courseId: Number(id),
      sectionName: sectionForm.sectionName,
      sectionDescription: sectionForm.sectionDescription,
    });

    setSectionForm({ courseId: id, sectionName: "", sectionDescription: "" });
    alert("Section added ✅");
    load();
  };

  // ✅ Add Topic
  const addTopic = async (e) => {
    e.preventDefault();

    if (!topicForm.sectionId) return alert("Select section first");
    if (!topicForm.topicName.trim()) return alert("Topic name is required");

    await api.post("/mentor/content/topics", {
      sectionId: Number(topicForm.sectionId),
      topicName: topicForm.topicName,
      topicDescription: topicForm.topicDescription,
    });

    setTopicForm({ sectionId: "", topicName: "", topicDescription: "" });
    alert("Topic added ✅");
    load();
  };

  // ✅ Improve Topic (OpenAI)
  const improveTopic = async () => {
    if (!topicForm.topicName.trim()) return alert("Enter topic name first");

    try {
      const res = await api.post("/openai/improve-topic", {
        topicName: topicForm.topicName,
        topicDescription: topicForm.topicDescription,
      });

      // Backend returns JSON string inside: res.data.improved
      const improved = JSON.parse(res.data.improved);

      setTopicForm({
        ...topicForm,
        topicName: improved.topicName,
        topicDescription: improved.topicDescription,
      });

      alert("Topic improved ✅");
    } catch (err) {
      alert("OpenAI Improve failed. Check API key & backend logs.");
    }
  };

  // ✅ Upload Material
  const uploadMaterial = async (e) => {
    e.preventDefault();

    if (!materialForm.topicId) return alert("Enter Topic ID");
    if (!materialFile) return alert("Select file first");

    const fd = new FormData();
    fd.append("TopicId", materialForm.topicId);
    fd.append("MaterialType", materialForm.materialType);
    fd.append("Title", materialForm.title);
    fd.append("file", materialFile);

    await api.post("/mentor/materials/upload", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setMaterialForm({ topicId: "", materialType: 1, title: "" });
    setMaterialFile(null);

    alert("Material uploaded ✅");
    load();
  };

  // ✅ Create Assignment
  const createAssignment = async (e) => {
    e.preventDefault();

    if (!assignmentForm.title.trim()) return alert("Assignment title required");

    await api.post("/mentor/assignments", {
      courseId: Number(id),
      title: assignmentForm.title,
      description: assignmentForm.description,
      dueDate: assignmentForm.dueDate || null,
    });

    setAssignmentForm({ courseId: id, title: "", description: "", dueDate: "" });
    alert("Assignment created ✅");
    load();
  };

  if (loading) return <Loading text="Loading course details..." />;

  return (
    <div>
      {/* ✅ NAVBAR */}
      <nav className="navbar navbar-dark bg-dark px-3">
        <Link className="navbar-brand fw-bold" to="/mentor/courses">
          ← Back
        </Link>
      </nav>

      <div className="container py-4">
        {/* ✅ COURSE CARD */}
        <div className="card shadow-sm p-4 mb-4">
          <h4 className="fw-bold">{data?.course?.title}</h4>
          <p className="text-muted">{data?.course?.description}</p>

          <div className="row g-3">
            <div className="col-md-4">
              <img
                src={
                  data?.course?.thumbnailUrl
                    ? BACKEND_BASE + data.course.thumbnailUrl
                    : "https://via.placeholder.com/400x220?text=Course"
                }
                className="img-fluid rounded"
                style={{ height: 220, objectFit: "cover", width: "100%" }}
                alt="course thumbnail"
              />
            </div>

            <div className="col-md-8">
              <h6 className="fw-bold">Extra Note</h6>
              <p className="text-muted">{data?.course?.extraNote || "No extra notes added."}</p>
            </div>
          </div>
        </div>

        {/* ✅ MAIN GRID */}
        <div className="row g-4">
          {/* ✅ LEFT PANEL */}
          <div className="col-md-4">
            {/* ✅ Add Section */}
            <div className="card shadow-sm p-4 mb-4">
              <h5 className="fw-bold">Add Section</h5>
              <form onSubmit={addSection}>
                <div className="mb-2">
                  <label className="form-label">Section Name</label>
                  <input
                    className="form-control"
                    value={sectionForm.sectionName}
                    onChange={(e) =>
                      setSectionForm({ ...sectionForm, sectionName: e.target.value })
                    }
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={sectionForm.sectionDescription}
                    onChange={(e) =>
                      setSectionForm({ ...sectionForm, sectionDescription: e.target.value })
                    }
                  />
                </div>

                <button className="btn btn-dark w-100 mt-2">Add Section</button>
              </form>
            </div>

            {/* ✅ Add Topic */}
            <div className="card shadow-sm p-4 mb-4">
              <h5 className="fw-bold">Add Topic</h5>

              <form onSubmit={addTopic}>
                <div className="mb-2">
                  <label className="form-label">Select Section</label>
                  <select
                    className="form-select"
                    value={topicForm.sectionId}
                    onChange={(e) => setTopicForm({ ...topicForm, sectionId: e.target.value })}
                  >
                    <option value="">-- Select --</option>
                    {data?.sections?.map((s) => (
                      <option key={s.sectionId} value={s.sectionId}>
                        {s.sectionName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-2">
                  <label className="form-label">Topic Name</label>
                  <input
                    className="form-control"
                    value={topicForm.topicName}
                    onChange={(e) => setTopicForm({ ...topicForm, topicName: e.target.value })}
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label">Topic Description</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={topicForm.topicDescription}
                    onChange={(e) =>
                      setTopicForm({ ...topicForm, topicDescription: e.target.value })
                    }
                  />
                </div>

                {/* ✅ OpenAI Improve Button */}
                <button
                  type="button"
                  className="btn btn-warning w-100 mt-2"
                  onClick={improveTopic}
                >
                  Improve Topic (AI)
                </button>

                <button className="btn btn-dark w-100 mt-2">Add Topic</button>
              </form>
            </div>

            {/* ✅ Upload Material */}
            <div className="card shadow-sm p-4 mb-4">
              <h5 className="fw-bold">Upload Material</h5>

              <form onSubmit={uploadMaterial}>
                <div className="mb-2">
                  <label className="form-label">Topic ID</label>
                  <input
                    className="form-control"
                    value={materialForm.topicId}
                    onChange={(e) => setMaterialForm({ ...materialForm, topicId: e.target.value })}
                    placeholder="Enter Topic ID"
                  />
                  <div className="text-muted small mt-1">
                    Tip: Expand section and copy Topic ID.
                  </div>
                </div>

                <div className="mb-2">
                  <label className="form-label">Material Type</label>
                  <select
                    className="form-select"
                    value={materialForm.materialType}
                    onChange={(e) =>
                      setMaterialForm({ ...materialForm, materialType: e.target.value })
                    }
                  >
                    <option value={1}>Video</option>
                    <option value={2}>PDF</option>
                    <option value={3}>PPT</option>
                    <option value={4}>Link File</option>
                  </select>
                </div>

                <div className="mb-2">
                  <label className="form-label">Title</label>
                  <input
                    className="form-control"
                    value={materialForm.title}
                    onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                    placeholder="Optional title"
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label">File</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) => setMaterialFile(e.target.files[0])}
                  />
                </div>

                <button className="btn btn-dark w-100 mt-2">Upload</button>
              </form>
            </div>

            {/* ✅ Add Assignment */}
            <div className="card shadow-sm p-4">
              <h5 className="fw-bold">Add Assignment</h5>

              <form onSubmit={createAssignment}>
                <div className="mb-2">
                  <label className="form-label">Title</label>
                  <input
                    className="form-control"
                    value={assignmentForm.title}
                    onChange={(e) =>
                      setAssignmentForm({ ...assignmentForm, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={assignmentForm.description}
                    onChange={(e) =>
                      setAssignmentForm({ ...assignmentForm, description: e.target.value })
                    }
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label">Due Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={assignmentForm.dueDate}
                    onChange={(e) =>
                      setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })
                    }
                  />
                </div>

                <button className="btn btn-dark w-100 mt-2">Create Assignment</button>
              </form>
            </div>
          </div>

          {/* ✅ RIGHT PANEL */}
          <div className="col-md-8">
            {/* ✅ Sections & Topics */}
            <div className="card shadow-sm p-4 mb-4">
              <h5 className="fw-bold">Sections & Topics</h5>

              {data?.sections?.map((s) => (
                <div className="mt-3" key={s.sectionId}>
                  <button
                    className="btn btn-outline-dark w-100 text-start"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#sec_${s.sectionId}`}
                  >
                    📌 {s.sectionName} (ID: {s.sectionId})
                  </button>

                  <div className="collapse mt-2" id={`sec_${s.sectionId}`}>
                    <div className="border rounded p-3">
                      <p className="text-muted mb-2">{s.sectionDescription}</p>

                      {s.topics.map((t) => (
                        <div key={t.topicId} className="mb-3">
                          <button
                            className="btn btn-outline-secondary w-100 text-start"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#topic_${t.topicId}`}
                          >
                            ✅ {t.topicName} (Topic ID: {t.topicId})
                          </button>

                          <div className="collapse mt-2" id={`topic_${t.topicId}`}>
                            <div className="bg-light rounded p-3">
                              <p className="text-muted">{t.topicDescription}</p>

                              <h6 className="fw-bold">Materials</h6>

                              {t.materials.length === 0 ? (
                                <div className="text-muted small">No materials uploaded.</div>
                              ) : (
                                <ul className="list-group">
                                  {t.materials.map((m) => (
                                    <li
                                      key={m.materialId}
                                      className="list-group-item d-flex justify-content-between align-items-center"
                                    >
                                      <div>
                                        <div className="fw-semibold">{m.title || "Lecture Material"}</div>
                                        <div className="text-muted small">
                                          Type: {m.materialType} | ID: {m.materialId}
                                        </div>
                                      </div>

                                      <a
                                        className="btn btn-sm btn-dark"
                                        target="_blank"
                                        rel="noreferrer"
                                        href={BACKEND_BASE + m.materialUrl}
                                      >
                                        Open
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {s.topics.length === 0 && (
                        <div className="text-muted small mt-2">No topics yet.</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {data?.sections?.length === 0 && (
                <div className="text-muted mt-3">No sections added yet.</div>
              )}
            </div>

            {/* ✅ Assignments List */}
            <div className="card shadow-sm p-4">
              <h5 className="fw-bold">Assignments</h5>

              {assignments.length === 0 ? (
                <div className="text-muted">No assignments yet.</div>
              ) : (
                <ul className="list-group mt-2">
                  {assignments.map((a) => (
                    <li key={a.assignmentId} className="list-group-item">
                      <div className="fw-semibold">{a.title}</div>
                      <div className="text-muted small">{a.description}</div>
                      <div className="text-muted small">
                        Due: {a.dueDate ? a.dueDate.substring(0, 10) : "Not set"}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
