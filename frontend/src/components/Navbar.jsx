// src/components/Navbar.jsx
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <div className="logo-icon">T</div>
        ThinkGPT
      </Link>

      <ul className="navbar-links">
        <li><Link to="/"         className={pathname === "/"         ? "active" : ""}>Home</Link></li>
        <li><Link to="/features" className={pathname === "/features" ? "active" : ""}>Features</Link></li>
        <li><Link to="/about"    className={pathname === "/about"    ? "active" : ""}>About</Link></li>
      </ul>

      <div className="navbar-actions">
        <Link to="/login">
          <button className="btn-ghost">Log in</button>
        </Link>
        <Link to="/chat">
          <button className="btn-primary">Launch App →</button>
        </Link>
      </div>
    </nav>
  );
}