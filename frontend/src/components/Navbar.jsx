// // // src/components/Navbar.jsx
// // import { Link, useLocation } from "react-router-dom";

// // export default function Navbar() {
// //   const { pathname } = useLocation();

// //   return (
// //     <nav className="navbar">
// //       <Link to="/" className="navbar-logo">
// //         <div className="logo-icon">T</div>
// //         ThinkGPT
// //       </Link>

// //       <ul className="navbar-links">
// //         <li><Link to="/"         className={pathname === "/"         ? "active" : ""}>Home</Link></li>
// //         <li><Link to="/features" className={pathname === "/features" ? "active" : ""}>Features</Link></li>
// //         <li><Link to="/about"    className={pathname === "/about"    ? "active" : ""}>About</Link></li>
// //       </ul>

// //       <div className="navbar-actions">
// //         <Link to="/login">
// //           <button className="btn-ghost">Log in</button>
// //         </Link>
// //         <Link to="/chat">
// //           <button className="btn-primary">Launch App →</button>
// //         </Link>
// //       </div>
// //     </nav>
// //   );
// // }

// import { useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function Navbar() {
//   const { pathname } = useLocation();
//   const navigate = useNavigate();

//   const { user, isAuthenticated, authLoading, logout } = useAuth();

//   const [menuOpen, setMenuOpen] = useState(false);
//   const [logoutError, setLogoutError] = useState("");

//   const handleLogout = async () => {
//     setLogoutError("");

//     try {
//       await logout();
//       setMenuOpen(false);
//       navigate("/", { replace: true });
//     } catch (error) {
//       setLogoutError(error.message || "Could not sign out. Please try again.");
//     }
//   };

//   const displayName = user?.name || user?.email || "Account";
//   const initial = displayName.charAt(0).toUpperCase();

//   return (
//     <nav className="navbar">
//       <Link to="/" className="navbar-logo">
//         <div className="logo-icon">T</div>
//         ThinkGPT
//       </Link>

//       <ul className="navbar-links">
//         <li>
//           <Link to="/" className={pathname === "/" ? "active" : ""}>
//             Home
//           </Link>
//         </li>

//         <li>
//           <Link
//             to="/features"
//             className={pathname === "/features" ? "active" : ""}
//           >
//             Features
//           </Link>
//         </li>

//         <li>
//           <Link
//             to="/about"
//             className={pathname === "/about" ? "active" : ""}
//           >
//             About
//           </Link>
//         </li>
//       </ul>

//       <div className="navbar-actions">
//         {isAuthenticated ? (
//           <div className="account-menu">
//             <button
//               type="button"
//               className="account-trigger"
//               onClick={() => setMenuOpen((open) => !open)}
//               aria-expanded={menuOpen}
//               aria-haspopup="true"
//             >
//               <span className="account-avatar">{initial}</span>
//               <span className="account-trigger-name">{displayName}</span>
//               <span className="account-chevron">
//                 {menuOpen ? "▲" : "▼"}
//               </span>
//             </button>

//             {menuOpen && (
//               <div className="account-dropdown">
//                 <div className="account-dropdown-user">
//                   <strong>{displayName}</strong>
//                   <span>{user?.email}</span>
//                 </div>

//                 <div className="account-dropdown-divider" />

//                 <Link to="/" onClick={() => setMenuOpen(false)}>
//                   Home
//                 </Link>

//                 <Link to="/features" onClick={() => setMenuOpen(false)}>
//                   Features
//                 </Link>

//                 <Link to="/about" onClick={() => setMenuOpen(false)}>
//                   About
//                 </Link>

//                 <Link to="/chat" onClick={() => setMenuOpen(false)}>
//                   Open ThinkGPT
//                 </Link>

//                 {logoutError && (
//                   <p className="account-menu-error">{logoutError}</p>
//                 )}

//                 <div className="account-dropdown-divider" />

//                 <button
//                   type="button"
//                   className="account-logout"
//                   onClick={handleLogout}
//                 >
//                   Sign out
//                 </button>
//               </div>
//             )}
//           </div>
//         ) : (
//           <>
//             <Link to="/login">
//               <button className="btn-ghost" type="button">
//                 {authLoading ? "Loading..." : "Log in"}
//               </button>
//             </Link>

//             <Link to="/chat">
//               <button className="btn-primary" type="button">
//                 Launch App →
//               </button>
//             </Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }


import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="navbar">

      {/* LOGO */}
      <Link to="/" className="navbar-logo">
        <div className="logo-icon">
          T
        </div>

        ThinkGPT
      </Link>

      {/* PUBLIC NAVIGATION */}
      <ul className="navbar-links">

        <li>
          <Link
            to="/"
            className={pathname === "/" ? "active" : ""}
          >
            Home
          </Link>
        </li>

        <li>
          <Link
            to="/features"
            className={pathname === "/features" ? "active" : ""}
          >
            Features
          </Link>
        </li>

        <li>
          <Link
            to="/about"
            className={pathname === "/about" ? "active" : ""}
          >
            About
          </Link>
        </li>

      </ul>

      {/* GUEST ACTIONS */}
      <div className="navbar-actions">

        <Link to="/login">
          <button
            className="btn-ghost"
            type="button"
          >
            Log in
          </button>
        </Link>

        <Link to="/chat">
          <button
            className="btn-primary"
            type="button"
          >
            Launch App →
          </button>
        </Link>

      </div>

    </nav>
  );
}
