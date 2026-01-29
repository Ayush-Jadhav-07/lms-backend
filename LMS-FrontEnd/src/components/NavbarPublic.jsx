import { Link } from "react-router-dom";

export default function NavbarPublic() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand fw-bold" to="/">LMS</Link>

      <div className="ms-auto d-flex gap-2">
        <Link className="btn btn-outline-light" to="/login">Login</Link>
        <Link className="btn btn-warning" to="/register">Register</Link>
      </div>
    </nav>
  );
}
