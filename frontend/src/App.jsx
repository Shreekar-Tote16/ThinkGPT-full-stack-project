// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AuroraBg from "./components/AuroraBg";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import FeaturesPage from "./pages/FeaturesPage";
import LoginPage from "./pages/LoginPage";
import ChatPage from "./pages/ChatPage";
import "./index.css";

// Pages that show the navbar (not the full-screen chat)
const PUBLIC_PAGES = ["/", "/about", "/features", "/login", "/get-started"];

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Chat is a standalone full-screen layout */}
        <Route path="/chat" element={<ChatPage />} />

        {/* Public pages with shared Navbar + Aurora background */}
        <Route
          path="/*"
          element={
            <>
              <AuroraBg />
              <Navbar />
              <Routes>
                <Route path="/"            element={<HomePage />} />
                <Route path="/about"       element={<AboutPage />} />
                <Route path="/features"    element={<FeaturesPage />} />
                <Route path="/login"       element={<LoginPage />} />
                <Route path="/get-started" element={<LoginPage signup />} />
              </Routes>
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}