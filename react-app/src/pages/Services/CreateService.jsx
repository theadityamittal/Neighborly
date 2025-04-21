import React, { Component, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

// Reusable Component
import FormLocationPicker from '../../components/LocationPicker/FormLocationPicker';
import InfoTooltip from '../../components/InfoTooltip/InfoTooltip'; 

// Styles
import "./CreateService.css";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const CreateService = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [image, setImage] = useState(null);
  const [earliestAvailability, setEarliestAvailability] = useState('');
  const [price, setPrice] = useState('');
  const [quota, setQuota] = useState('');

  // Location
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('');
  const [stateRegion, setStateRegion] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [location, setLocation] = useState('');

  

  const { name, user_id, access } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleServiceSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('service_provider', user_id);  // Use logged-in user's ID for the provider
    formData.append('latitude', latitude ?? '');
    formData.append('longitude', longitude ?? '');
    formData.append('location', location);
    formData.append('address_line1', addressLine1);
    formData.append('city', city);
    formData.append('state', stateRegion);
    formData.append('zip_code', zipCode);
    formData.append('visibility', visibility);
    formData.append('date_posted', new Date().toISOString());  // Current date
    formData.append('earliest_availability', earliestAvailability);
    formData.append('price', price);
    formData.append('quota', quota);
    if (image) formData.append('image', image);  // Image upload
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
  
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
            
            <label className="input-label">
              Price (optional)
              <InfoTooltip text="Set a daily price if you'd like to charge for this service. Leave it blank for free services." />
            </label>
            <input className="input" type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 25"/>

            <label className="input-label">Quota (optional)</label>
            <input className="input" type="number" min="1" value={quota} onChange={(e) => setQuota(e.target.value)} placeholder="Max number of participants"/>          

          </div>

          <div className="form-right">
          <FormControl>
              <label className="input-label">Visibility</label>
              <RadioGroup
                row
                aria-labelledby="visibility-group-label"
                name="visibility"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
              >
                <FormControlLabel value="public" control={<Radio />} label="Public" />
                <FormControlLabel value="neighborhood" control={<Radio />} label="Neighborhood Only" />
                <FormControlLabel value="invitation" control={<Radio />} label="Invitation Only" />
              </RadioGroup>
            </FormControl>
          <FormLocationPicker
            location={location}
            setLocation={(val) => {
              if (val) setLocation(val);
            }}
            onCoordinatesChange={(loc) => {
              if (loc.latitude) setLatitude(loc.latitude);
              if (loc.longitude) setLongitude(loc.longitude);
              if (loc.addressLine1) setAddressLine1(loc.addressLine1);
              if (loc.city) setCity(loc.city);
              if (loc.state) setStateRegion(loc.state);
              if (loc.zipCode) setZipCode(loc.zipCode);
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
