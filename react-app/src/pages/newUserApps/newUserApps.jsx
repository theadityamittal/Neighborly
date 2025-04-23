import React, { useState, useEffect } from "react";
import "./newUserApps.css";
import HorizontalCard from "../../components/HorizontalCard/HorizontalCard";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { getApps } from "../../services/newUserAppsService";
import { Button } from "@mui/material";
import { verifyApp, getUserInformation} from "../../services/newUserAppsService";

const Modal = ({ app, onClose }) => {
    const { access } = useSelector((state) => state.auth);
    const [userInfo, setUserInfo] = useState(null);
  
    useEffect(() => {
        setUserInfo(null);
        const fetchUserInformation = async () => {
          if (!app) return;
      
          const data = { user_id: app.user_id };
      
          try {
            const response = await getUserInformation(data, access);
            setUserInfo(response);
          } catch (error) {
            console.error("Error fetching user information:", error);
          }
        };
      
        fetchUserInformation();
      }, [app]); 
  
    const verifyAppCall = async () => {
      const data = { user_id: app.user_id };
  
      try {
        const response = await verifyApp(data, access);
        console.log("App verified successfully:", response.data);
        alert("App verified successfully!");
        onClose();
      } catch (error) {
        console.error("Error verifying app:", error);
      }
    };
  
    if (!app) return null;
  
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content app-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>×</button>
          <img src={app.file} alt={app.app_name} className="modal-image app-image" />
  
          {userInfo ? (
            <>
              <p className="modal-description app-description">Address: {userInfo.address}</p>
              <p className="modal-description app-description">Neighborhood: {userInfo.neighborhood}</p>
              <p className="modal-description app-description">Name: {userInfo.name}</p>
            </>
          ) : (
            <p className="modal-description app-description">Loading user info...</p>
          )}
            <p className="modal-description app-description">Description: {app.description}</p>
  
          <Button
            variant="contained"
            color="primary"
            onClick={verifyAppCall}
            className="modal-button"
          >
            Verify
          </Button>
        </div>
      </div>
    );
  };

const NewUserApps = () => {
  const [apps, setApps] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const { access, user_id } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {

      try {
        const response = await getApps(access);
        setApps(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="apps-page">
      <>
        <div className="apps-header">
          <h2>New User Verification </h2>

        </div>
        <div className="apps-list">
          {apps.map((app) => (
            <div key={app.ud_id} className="apps-item">
              <HorizontalCard
                id={app.ud_id}
                provider={app.description}
                image={app.file}
                viewType="card"
                onView={() => setSelectedApp(app)}
              />
            </div>
          ))}
        </div>
      </>
      <Modal app={selectedApp} onClose={() => setSelectedApp(null)} />
    </div>
  );
};

export default NewUserApps;
