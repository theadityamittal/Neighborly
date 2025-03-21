import React from "react";
import { Routes, Route } from "react-router-dom";
import Tools from "../pages/Tools/Tools";
import Bulletin from "../pages/Bulletin/Bulletin";
import Services from "../pages/Services/Services";
import Events from "../pages/Events/Events";
import Petitions from "../pages/Petitions/Petitions";
import UserProfile from "../pages/UserProfile/UserProfile";
import CardTest from "../pages/CardTest/CardTest";

const AppRoutes = () => {
  return (
      <div className="main-content" style={{ flex: 1, padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Bulletin />} />
          <Route path="/test" element={<CardTest />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/services" element={<Services />} />
          <Route path="/events" element={<Events />} />
          <Route path="/petitions" element={<Petitions />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </div>
  );
};

export default AppRoutes;
