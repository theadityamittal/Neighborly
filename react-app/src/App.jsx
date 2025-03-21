import React from "react";
import AppRoutes from "./routes/AppRoutes"; // Ensure this path is correct
import { BrowserRouter } from "react-router-dom";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Header /> {/* Header should always be visible */}
      <Sidebar /> {/* Sidebar should always be visible */}
      <AppRoutes /> {/* Main content area for routing */}
    </BrowserRouter>
  );
}

export default App;


