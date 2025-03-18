import React from "react";
import { Routes, Route } from "react-router";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Tools from "../pages/Tools";
import Bulletin from "../pages/Bulletin";
import Services from "../pages/Services";
import Events from "../pages/Events";
import Petitions from "../pages/Petitions";
import UserProfile from "../pages/UserProfile";

const AppRoutes = () => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar /> {/* Sidebar should always be visible */}
      <div className="main-content" style={{ flex: 1, padding: "20px" }}>
        <Navbar /> {/* Navbar should always be visible */}
        <Routes>
          <Route path="/" element={<Bulletin />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/services" element={<Services />} />
          <Route path="/events" element={<Events />} />
          <Route path="/petitions" element={<Petitions />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </div>
    </div>
  );
};

export default AppRoutes;
