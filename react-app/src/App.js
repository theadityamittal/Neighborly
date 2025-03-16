import React from "react";
import Navbar from "/workspaces/Neighborly/react-app/src/components/Navbar/Navbar.js";
import Sidebar from "/workspaces/Neighborly/react-app/src/components/Sidebar/Sidebar.js";

import "/workspaces/Neighborly/react-app/src/App.css";

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
