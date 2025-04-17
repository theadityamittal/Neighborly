import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import "./ProtectedLayout.css";

const ProtectedLayout = () => (
    <div className="protected-layout">
      {/* fixed header */}
      <div className="protected-layout__header">
        <Header />
      </div>
  
      {/* fixed sidebar below header */}
      <div className="protected-layout__sidebar">
        <Sidebar />
      </div>
  
      {/* main content pushed below header and to the right of sidebar */}
      <div className="protected-layout__content">
        <Outlet />
      </div>
    </div>
  );
  

export default ProtectedLayout;
