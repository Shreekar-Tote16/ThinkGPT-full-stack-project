// // src/App.jsx
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import AuroraBg from "./components/AuroraBg";
// import HomePage from "./pages/HomePage";
// import AboutPage from "./pages/AboutPage";
// import FeaturesPage from "./pages/FeaturesPage";
// import LoginPage from "./pages/LoginPage";
// import ChatPage from "./pages/ChatPage";
// import "./index.css";

// // Pages that show the navbar (not the full-screen chat)
// const PUBLIC_PAGES = ["/", "/about", "/features", "/login", "/get-started"];

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Chat is a standalone full-screen layout */}
//         <Route path="/chat" element={<ChatPage />} />

//         {/* Public pages with shared Navbar + Aurora background */}
//         <Route
//           path="/*"
//           element={
//             <>
//               <AuroraBg />
//               <Navbar />
//               <Routes>
//                 <Route path="/"            element={<HomePage />} />
//                 <Route path="/about"       element={<AboutPage />} />
//                 <Route path="/features"    element={<FeaturesPage />} />
//                 <Route path="/login"       element={<LoginPage />} />
//                 <Route path="/get-started" element={<LoginPage signup />} />
//               </Routes>
//             </>
//           }
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }


import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import { useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import AuroraBg from "./components/AuroraBg";

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import FeaturesPage from "./pages/FeaturesPage";
import LoginPage from "./pages/LoginPage";
import ChatPage from "./pages/ChatPage";

import "./index.css";

// ============================================================
// PUBLIC WEBSITE LAYOUT
// ============================================================

function PublicLayout() {
  const { isAuthenticated, authLoading } = useAuth();

  // Prevent the public website from briefly appearing
  // while the backend restores an existing login session.
  if (authLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "var(--space-black)",
          color: "var(--off-white)",
          fontFamily: "var(--font)",
          fontSize: "0.9rem",
        }}
        role="status"
      >
        Restoring your ThinkGPT session...
      </div>
    );
  }

  // Logged-in users should always enter the AI workspace.
  if (isAuthenticated) {
    return <Navigate to="/chat" replace />;
  }

  // Public website is available only to guests.
  return (
    <>
      <AuroraBg />
      <Navbar />
      <Outlet />
    </>
  );
}

// ============================================================
// APP ROUTES
// ============================================================

function AppRoutes() {
  return (
    <Routes>

      {/* Full-screen AI workspace.
          Available to registered users and guests. */}
      <Route
        path="/chat"
        element={<ChatPage />}
      />

      {/* Public website routes */}
      <Route element={<PublicLayout />}>

        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/about"
          element={<AboutPage />}
        />

        <Route
          path="/features"
          element={<FeaturesPage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/get-started"
          element={<LoginPage signup />}
        />

      </Route>

      {/* Unknown routes return to the appropriate entry point. */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}

// ============================================================
// ROOT APP
// ============================================================

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
