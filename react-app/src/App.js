import React from "react";
import AppRoutes from "./routes/AppRoutes"; // Ensure this path is correct
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;