import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import FormLocationPicker from '../../components/LocationPicker/FormLocationPicker';

import "./CreateService.css";

const CreateService = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const [earliestAvailability, setEarliestAvailability] = useState('');
  const { name, user_id, access } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleServiceSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('service_provider', user_id);  // Use logged-in user's ID for the provider
    formData.append('location', location);
    formData.append('latitude', latitude ?? '');
    formData.append('longitude', longitude ?? '');
    formData.append('date_posted', new Date().toISOString());  // Current date
    formData.append('earliest_availability', earliestAvailability);
    if (image) formData.append('image', image);  // Image upload

    try {
      const response = await axiosInstance.post("/api/services/", formData, {
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Service created successfully!");
      navigate("/services"); // Navigate back to the Services page
    } catch (error) {
      console.error("Error creating service:", error);
    }
  };

  return (
    <div className="create-service-page">
      <button className="back-btn" onClick={() => navigate("/services")}>← Back to Services</button>
      <form className="form-container" encType="multipart/form-data" onSubmit={handleServiceSubmit}>
        <h1 className="form-title">Create New Service</h1>

        <div className="two-column-row">
          <div className="form-left">
            <label className="input-label">Title</label>
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />

            <label className="input-label">Earliest Availability</label>
            <input className="input" type="date" value={earliestAvailability} onChange={(e) => setEarliestAvailability(e.target.value)} />

            <label className="input-label">Description</label>
            <textarea className="textarea" value={description} onChange={(e) => setDescription(e.target.value)} />

            <label className="input-label">Image Upload</label>
            <input className="input" type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
          </div>

          <div className="form-right">
            <FormLocationPicker
              location={location}
              setLocation={setLocation}
              onCoordinatesChange={({ latitude, longitude }) => {
                setLatitude(latitude);
                setLongitude(longitude);
              }}
            />
          </div>
        </div>

        

        <button className="submit-btn" type="submit">Create Service</button>
      </form>

      
    </div>
  );
};

export default CreateService;
