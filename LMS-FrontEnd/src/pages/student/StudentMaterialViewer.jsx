import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";
import Loading from "../../components/Loading";

const BACKEND_BASE = "https://localhost:7015";

export default function StudentMaterialViewer() {
  const { materialId } = useParams();

  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);

    // ✅ We need backend API to get material by ID
    const res = await api.get(`/materials/${materialId}`);
    setMaterial(res.data);

    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <Loading text="Loading material..." />;
  if (!material) return <div className="container py-4">Material not found.</div>;

  // ✅ Handle both uploaded file and external link
  const url = material.materialUrl?.startsWith("http")
    ? material.materialUrl
    : BACKEND_BASE + material.materialUrl;

  return (
    <div>
      <nav className="navbar navbar-dark bg-dark px-3">
        <Link className="navbar-brand fw-bold" to="/student">
          ← Back
        </Link>
      </nav>

      <div className="container py-4">
        <div className="card shadow-sm p-4">
          <h4 className="fw-bold">{material.title || "Lecture Material"}</h4>
          <p className="text-muted mb-0">Type: {material.materialType}</p>

          <hr />

          {/* ✅ Video Player */}
          {material.materialType === 1 && (
            <div>
              <h6 className="fw-bold">Video Lecture</h6>
              <video
                controls
                style={{
                  width: "100%",
                  maxHeight: "450px",
                  borderRadius: "10px",
                }}
              >
                <source src={url} />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {/* ✅ PDF Viewer */}
          {material.materialType === 2 && (
            <div>
              <h6 className="fw-bold">PDF Notes</h6>
              <iframe
                src={url}
                title="PDF Viewer"
                style={{
                  width: "100%",
                  height: "600px",
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                }}
              />
            </div>
          )}

          {/* ✅ PPT Viewer (Download/Open) */}
          {material.materialType === 3 && (
            <div>
              <h6 className="fw-bold">PPT File</h6>
              <p className="text-muted">
                PPT cannot always be previewed in browser. Download and open in PowerPoint.
              </p>

              <a className="btn btn-dark" href={url} download>
                Download PPT
              </a>

              <a className="btn btn-outline-dark ms-2" href={url} target="_blank" rel="noreferrer">
                Open in New Tab
              </a>
            </div>
          )}

          {/* ✅ External Link Viewer */}
          {material.materialType === 4 && (
            <div>
              <h6 className="fw-bold">External Link</h6>
              <a href={url} target="_blank" rel="noreferrer" className="btn btn-dark mb-3">
                Open Link
              </a>

              <iframe
                src={url}
                title="External Link"
                style={{
                  width: "100%",
                  height: "600px",
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
