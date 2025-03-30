import React from "react";
import AppRoutes from "./routes/AppRoutes"; // Ensure this path is correct
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { RouteProvider } from "./context/RouteContext";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <RouteProvider>
          <AppRoutes /> {/* Main content area for routing */}
        </RouteProvider>
      </BrowserRouter>
    </Provider>
  );
}

export default App;


