import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";
import Loading from "../../components/Loading";

const BACKEND_BASE = "https://localhost:7015";

export default function StudentCourseDetails() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [content, setContent] = useState([]);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Assignments
  const [assignments, setAssignments] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({}); 
  // { assignmentId: File }

  const loadCourse = async () => {
    setLoading(true);

    // ✅ Get all courses and pick current one
    const allCourses = await api.get("/student/courses");
    const found = allCourses.data.find((x) => x.courseId === Number(id));
    setCourse(found);

    // ✅ Check enrollment using MyCourses
    const my = await api.get("/student/courses/my");
    const isEnrolled = my.data.some((x) => x.courseId === Number(id));
    setEnrolled(isEnrolled);

    // ✅ If enrolled → load content + assignments
    if (isEnrolled) {
      const contentRes = await api.get(`/student/courses/${id}/content`);
      setContent(contentRes.data);

      const assRes = await api.get(`/student/assignments/course/${id}`);
      setAssignments(assRes.data);
    } else {
      setContent([]);
      setAssignments([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadCourse();
  }, []);

  const enrollNow = async () => {
    try {
      await api.post(`/student/courses/${id}/enroll`);
      alert("Enrolled Successfully ✅");
      loadCourse();
    } catch (err) {
      alert(err?.response?.data || "Enrollment failed");
    }
  };

  const submitAssignment = async (assignmentId) => {
    const file = selectedFiles[assignmentId];
    if (!file) return alert("Please select a file first!");

    try {
      const fd = new FormData();
      fd.append("file", file);

      await api.post(`/student/assignments/${assignmentId}/submit`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Assignment submitted ✅");
      // optional reload (if you want to show submissions later)
      // loadCourse();
    } catch (err) {
      alert(err?.response?.data || "Submission failed");
    }
  };

  if (loading) return <Loading text="Loading course..." />;

  return (
    <div>
      {/* ✅ NAVBAR */}
      <nav className="navbar navbar-dark bg-dark px-3">
        <Link className="navbar-brand fw-bold" to="/student">
          ← Back
        </Link>
        <div className="ms-auto">
          <Link className="btn btn-outline-light" to="/student/mycourses">
            MyCourses
          </Link>
        </div>
      </nav>

      <div className="container py-4">
        {/* ✅ COURSE DETAILS */}
        <div className="card shadow-sm p-4 mb-4">
          <div className="row g-3">
            <div className="col-md-4">
              <img
                src={
                  course?.thumbnailUrl
                    ? BACKEND_BASE + course.thumbnailUrl
                    : "https://via.placeholder.com/400x220?text=Course"
                }
                className="img-fluid rounded"
                style={{ height: 220, objectFit: "cover", width: "100%" }}
                alt="course thumbnail"
              />
            </div>

            <div className="col-md-8">
              <h3 className="fw-bold">{course?.title}</h3>
              <p className="text-muted">{course?.description}</p>

              {!enrolled ? (
                <button className="btn btn-dark" onClick={enrollNow}>
                  Enroll Now
                </button>
              ) : (
                <span className="badge bg-success fs-6">✅ Enrolled</span>
              )}
            </div>
          </div>
        </div>

        {/* ✅ COURSE CONTENT */}
        <div className="card shadow-sm p-4 mb-4">
          <h5 className="fw-bold">Course Content</h5>

          {!enrolled ? (
            <div className="text-muted mt-2">
              Please enroll to view sections, topics and lecture materials.
            </div>
          ) : (
            <>
              {content.map((s) => (
                <div key={s.sectionId} className="mt-3">
                  <button
                    className="btn btn-outline-dark w-100 text-start"
                    data-bs-toggle="collapse"
                    data-bs-target={`#sec_${s.sectionId}`}
                  >
                    📌 {s.sectionName}
                  </button>

                  <div className="collapse mt-2" id={`sec_${s.sectionId}`}>
                    <div className="border rounded p-3">
                      <p className="text-muted">{s.sectionDescription}</p>

                      {s.topics.map((t) => (
                        <div key={t.topicId} className="mb-3">
                          <button
                            className="btn btn-outline-secondary w-100 text-start"
                            data-bs-toggle="collapse"
                            data-bs-target={`#topic_${t.topicId}`}
                          >
                            ✅ {t.topicName}
                          </button>

                          <div className="collapse mt-2" id={`topic_${t.topicId}`}>
                            <div className="bg-light rounded p-3">
                              <p className="text-muted">{t.topicDescription}</p>

                              <h6 className="fw-bold">Materials</h6>
                              {t.materials.length === 0 ? (
                                <div className="text-muted small">
                                  No materials uploaded yet.
                                </div>
                              ) : (
                                <div className="mt-2">
                                  {t.materials.map((m) => (
                                    <div
                                      key={m.materialId}
                                      className="d-flex justify-content-between align-items-center border rounded p-2 mb-2"
                                    >
                                      <div>
                                        <div className="fw-semibold">
                                          {m.title || "Lecture Material"}
                                        </div>
                                        <div className="text-muted small">
                                          Type: {m.materialType}
                                        </div>
                                      </div>

                                        <Link className="btn btn-sm btn-dark" to={`/student/material/${m.materialId}`}>
                                            View
                                        </Link>

                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {s.topics.length === 0 && (
                        <div className="text-muted small">No topics yet.</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {content.length === 0 && (
                <div className="text-muted mt-3">
                  Mentor has not uploaded any content yet.
                </div>
              )}
            </>
          )}
        </div>

        {/* ✅ ASSIGNMENTS + SUBMISSION */}
        {enrolled && (
          <div className="card shadow-sm p-4">
            <h5 className="fw-bold">Assignments</h5>

            {assignments.length === 0 ? (
              <div className="text-muted mt-2">
                No assignments added yet by mentor.
              </div>
            ) : (
              <div className="mt-3">
                {assignments.map((a) => (
                  <div key={a.assignmentId} className="border rounded p-3 mb-3">
                    <div className="fw-semibold">{a.title}</div>
                    <div className="text-muted small">{a.description}</div>
                    <div className="text-muted small">
                      Due: {a.dueDate ? a.dueDate.substring(0, 10) : "Not set"}
                    </div>

                    <div className="mt-3">
                      <label className="form-label fw-semibold">
                        Upload Submission File
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={(e) =>
                          setSelectedFiles({
                            ...selectedFiles,
                            [a.assignmentId]: e.target.files[0],
                          })
                        }
                      />

                      <button
                        className="btn btn-dark mt-2"
                        onClick={() => submitAssignment(a.assignmentId)}
                      >
                        Submit Assignment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
