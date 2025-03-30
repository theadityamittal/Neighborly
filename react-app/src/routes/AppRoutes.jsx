import React, { useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { useRoute } from "../context/RouteContext";
import { useDispatch } from "react-redux";
import { checkAuthState } from "../services/authService";
import Dashboard from "../components/Dashboard/Dashboard";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import CardTest from "../pages/CardTest/CardTest";

// Protected route component
// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated, loading } = useSelector(state => state.user);
  
//   if (loading) return <div>Loading...</div>;
  
//   if (!isAuthenticated) {
//     return <Navigate to="/login" />;
//   }
  
//   return children;
// };

const AppRoutes = () => {
  const { currentRoute, setCurrentRoute } = useRoute();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const { user, isAuthenticated } = useSelector(state => state.user);

  const handleItemClick=(path) => {
    navigate(path);
  }

  useEffect(() => {
    dispatch(checkAuthState());
    // set auth to true for development purposes
  }, [dispatch]);

  // Update the current route when URL changes
  useEffect(() => {
    // Extract just the pathname from URL
    const path = window.location.pathname;
    setCurrentRoute(path);
  }, [setCurrentRoute, dispatch]);

  return (
    <>
      {/* Main layout */}
      <Routes>
        <Route path="/" element={<Dashboard currentRoute={currentRoute} setCurrentRoute={setCurrentRoute} handleItemClick={handleItemClick}/>} />
        <Route path="/bulletin" element={<Dashboard currentRoute={currentRoute} setCurrentRoute={setCurrentRoute} handleItemClick={handleItemClick}/>} />
        <Route path="/tools" element={<Dashboard currentRoute={currentRoute} setCurrentRoute={setCurrentRoute} handleItemClick={handleItemClick}/>} />
        <Route path="/services" element={<Dashboard currentRoute={currentRoute} setCurrentRoute={setCurrentRoute} handleItemClick={handleItemClick}/>} />
        <Route path="/events" element={<Dashboard currentRoute={currentRoute} setCurrentRoute={setCurrentRoute} handleItemClick={handleItemClick}/>} />
        <Route path="/petitions" element={<Dashboard currentRoute={currentRoute} setCurrentRoute={setCurrentRoute} handleItemClick={handleItemClick}/>} />
        <Route path="/profile" element={<Dashboard currentRoute={currentRoute} setCurrentRoute={setCurrentRoute} handleItemClick={handleItemClick}/>} />
        <Route path="/messages" element={<Dashboard currentRoute={currentRoute} setCurrentRoute={setCurrentRoute} handleItemClick={handleItemClick}/>} />
        <Route path="/notifications" element={<Dashboard currentRoute={currentRoute} setCurrentRoute={setCurrentRoute} handleItemClick={handleItemClick}/>} />

        {/* Protected routes */}
        {/* <Route path="/" element={
          <ProtectedRoute>
            <Dashboard currentRoute={currentRoute} setCurrentRoute={setCurrentRoute} handleItemClick={handleItemClick}/>
          </ProtectedRoute>
        } />
        <Route path="/tools" element={
          <ProtectedRoute>
            <Dashboard currentRoute={currentRoute} setCurrentRoute={setCurrentRoute} handleItemClick={handleItemClick}/>
          </ProtectedRoute>
        } />
        <Route path="/services" element={
          <ProtectedRoute>
            <Dashboard currentRoute={currentRoute} setCurrentRoute={setCurrentRoute} handleItemClick={handleItemClick}/>
          </ProtectedRoute>
        } />
        <Route path="/events" element={
          <ProtectedRoute>
            <Dashboard currentRoute={currentRoute} setCurrentRoute={setCurrentRoute} handleItemClick={handleItemClick}/>
          </ProtectedRoute>
        } />
        <Route path="/petitions" element={
          <ProtectedRoute>
            <Dashboard currentRoute={currentRoute} setCurrentRoute={setCurrentRoute} handleItemClick={handleItemClick}/>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Dashboard currentRoute={currentRoute} setCurrentRoute={setCurrentRoute} handleItemClick={handleItemClick}/>
          </ProtectedRoute>
        } />
        <Route path="/bulletin" element={
          <ProtectedRoute>
            <Dashboard currentRoute={currentRoute} setCurrentRoute={setCurrentRoute} handleItemClick={handleItemClick}/>
          </ProtectedRoute>
        } /> */}

        {/* Dev Test Route */}
        <Route path="/test" element={<CardTest/>} />

        {/* Authentication routes */}
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        
        {/* Redirect to home if no match */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>

  );
};

export default AppRoutes;
