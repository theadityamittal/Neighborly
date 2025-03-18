import React from "react";
import Navbar from "./components/Navbar/Navbar.js";
import Sidebar from "./components/Sidebar/Sidebar.js";

import "./App.css"; // Import your CSS file for styling

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

/* Persistor Layout when User Sessions are implemented
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './redux/store';
import { Provider } from 'react-redux';


<Provider store={store}>
<PersistGate loading={null} persistor={persistor}>
// App in here
</PersistGate>
</Provider>

*/

export default App;
