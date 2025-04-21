import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import { selectAuth } from "../redux/authSlice";
import ProtectedLayout from "../components/ProtectedLayout";
import Events from "../pages/Events/Events";
import Services from "../pages/Services/Services";
import Tools from "../pages/Tools/Tools";
import Petitions from "../pages/Petitions/Petitions";
import CreatePetition from "../pages/Petitions/CreatePetition";
import DetailedPetition from "../pages/Petitions/DetailedPetition";
import UserProfile from "../pages/UserProfile/UserProfile";
import Bulletin from "../pages/Bulletin/Bulletin";
import CreateEvent from "../pages/Events/CreateEvent";
import CreateTool from "../pages/Tools/CreateTool"; 
import CreateService from "../pages/Services/CreateService";
import Verification from "../pages/Auth/Verification/Verification";

// Testing purpose
import CardTest from "../pages/CardTest/CardTest";
import MapTest from "../pages/MapTest/MapTest";


// Protected route component
const ProtectedRoute = ({ children }) => {
  const { access, verified } = useSelector(selectAuth);

  // uncomment for development purposes
  // return children;
  
  if (!access) {
    return <Navigate to="/login" />;
  }

  if (!verified) {
    return <Navigate to="/verification" />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <>
      {/* Main layout */}
      <Routes>
        {/* ----------- Public routes ----------- */}
        
        {/* Testing purpose */}
        <Route path="/test" element={<CardTest/>} />
        <Route path="/map-test" element={<MapTest/>} />

        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/verification" element={<Verification/>} />
        
        {/* --------- Protected routes ---------- */}
        <Route element = {
            <ProtectedRoute>
                <ProtectedLayout/>
            </ProtectedRoute>
        }>
            <Route path="/" element={<Bulletin />} />               {/* logo points here */}
            <Route path="/bulletin" element={<Bulletin />} />

            <Route path="/events" element={<Events />} />
            <Route path="/create-event" element={<CreateEvent />} />

            <Route path="/tools" element={<Tools />} />
            {/* <Route path="/create-tool" element={<CreateTool />} /> */}
            <Route path="/create-tool" element={<CreateTool />} />

            <Route path="/services" element={<Services />} />
            {/* <Route path="/create-service" element={<CreateService />} /> */}
            <Route path="/create-service" element={<CreateService />} />

            <Route path="/petitions" element={<Petitions />} />
            <Route path="/petition/:id" element={<DetailedPetition />} />
            <Route path="/create-petition" element={<CreatePetition />} />

            <Route path="/profile" element={<UserProfile />} />

            {/* Redirect to home if no match */}
            <Route path="*" element={<Navigate to="/" />} />
        </Route>

        
      </Routes>
    </>

  );
};

export default AppRoutes;