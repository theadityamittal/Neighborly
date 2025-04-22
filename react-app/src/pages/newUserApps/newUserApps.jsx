import React, { useState, useEffect } from "react";
import "./newUserApps.css";
import HorizontalCard from "../../components/HorizontalCard/HorizontalCard";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { getApps } from "../../services/newUserAppsService";
import { Button } from "@mui/material";

const Modal = ({ app, onClose }) => {
    const { access } = useSelector((state) => state.auth);
    const data = {
        "user_id": app ? app.user_id : null,
    }
    const verifyApp = async () => {
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
            <h2 className="modal-title">{app.app_name}</h2>
            <img src={app.file} alt={app.app_name} className="modal-image app-image" />
            <p className="modal-description app-description">{app.description}</p>
            <Button
                variant="contained"
                color="primary"
                onClick={verifyApp}
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
                tabs={[...(app.tags || []), app.visibility]}
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
