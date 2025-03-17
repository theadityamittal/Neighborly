import React from "react";
import Navbar from "components/Navbar/Navbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import "App.css";

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="layout">
        <Sidebar />
      </div>
    </div>
  );
}

export default App;
