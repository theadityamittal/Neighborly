import React from "react";
import AppRoutes from "./routes/AppRoutes"; // Ensure this path is correct
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { RouteProvider } from "./context/RouteContext";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";

function App() {
  return (
    <div className="zoom-90">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <RouteProvider>
              <AppRoutes />
            </RouteProvider>
          </BrowserRouter>
        </PersistGate>      
      </Provider>
    </div>
  );
}

export default App;


