import NavbarPublic from "../components/NavbarPublic";

export default function Landing() {
  return (
    <div>
      <NavbarPublic />

      <div className="container py-5">
        <div className="row align-items-center g-4">
          <div className="col-md-7">
            <h1 className="fw-bold">Learning Management System</h1>
            <p className="text-muted mt-3">
              Learn new skills, enroll in courses, watch lectures, submit assignments,
              and track progress—all in one platform.
            </p>

            <div className="mt-4 d-flex gap-2">
              <a className="btn btn-dark" href="/login">Login</a>
              <a className="btn btn-warning" href="/register">Register</a>
            </div>
          </div>

          <div className="col-md-5">
            <div className="card shadow-sm p-4">
              <h5 className="fw-bold">Key Features</h5>
              <ul className="mt-3 text-muted">
                <li>Admin: Manage categories and users</li>
                <li>Mentor: Create courses & upload materials</li>
                <li>Student: Enroll, learn, and submit assignments</li>
                <li>JWT Authentication + Role Security</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
