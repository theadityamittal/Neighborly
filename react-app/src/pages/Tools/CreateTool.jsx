import React, { Component, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

// Reusable Component
import FormLocationPicker from '../../components/LocationPicker/FormLocationPicker';
import InfoTooltip from '../../components/InfoTooltip/InfoTooltip'; 

// Styles
import "./CreateTool.css";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const CreateTool = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [image, setImage] = useState(null);
  const [closestAvailability, setClosestAvailability] = useState('');
  const [price, setPrice] = useState('');
  const [quota, setQuota] = useState('');
  const [condition, setCondition] = useState('');

  // Location
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateRegion, setStateRegion] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [location, setLocation] = useState('');

  const { name, user_id, access } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleToolSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('owner_id', user_id);  // Use logged-in user's ID for the provider

    formData.append('latitude', latitude ?? '');
    formData.append('longitude', longitude ?? '');
    formData.append('location', location);
    formData.append('street_address', streetAddress);
    formData.append('city', city);
    formData.append('state', stateRegion);
    formData.append('zip_code', zipCode);
    formData.append('visibility', visibility);
    formData.append('date_posted', new Date().toISOString());  // Current date
    formData.append('closestAvailability', closestAvailability);
    formData.append('price', price);
    formData.append('quota', quota);
    formData.append('condition', condition);
    if (image) formData.append('images', image);  // Image upload
// Debug logging loop removed to prevent exposure of sensitive data.
  
    try {
      const response = await axiosInstance.post("/tools/", formData, {
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Tool created successfully!");
      navigate("/tools"); // Navigate back to the Tools page
    } catch (error) {
      console.error("Error creating tool:", error);
    }
  };

  return (
    <div className="create-service-page">
      <button className="back-btn" onClick={() => navigate("/tools")}>← Back to Tools</button>
      <form className="form-container" encType="multipart/form-data" onSubmit={handleToolSubmit}>
        <h1 className="form-title">Create New Tool</h1>

        <div className="two-column-row">
          <div className="form-left">
            <label className="input-label">Title</label>
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />

            <label className="input-label">Earliest Availability</label>
            <input className="input" type="date" value={closestAvailability} onChange={(e) => setClosestAvailability(e.target.value)} />

            <label className="input-label">Description</label>
            <textarea className="textarea" value={description} onChange={(e) => setDescription(e.target.value)} />

            <label className="input-label">Image Upload</label>
            <input className="input" type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
            
            <label className="input-label">
              Price (optional)
              <InfoTooltip text="Set a daily price if you'd like to charge for this tool. Leave it blank for free tools." />
            </label>
            <input className="input" type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 25"/>

            <label className="input-label">Quota (optional)</label>
            <input className="input" type="number" min="1" value={quota} onChange={(e) => setQuota(e.target.value)} placeholder="Max number of participants"/>          
            
            <label className="input-label">Condition</label>
            <select
              className="input"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              required
            >
              <option value="">-- Select Condition --</option>
              <option value="New">New</option>
              <option value="Used">Used</option>
              <option value="Like New">Like New</option>
              <option value="Fair">Fair</option>
            </select>
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
              if (loc.streetAddress) setStreetAddress(loc.streetAddress);
              if (loc.city) setCity(loc.city);
              if (loc.state) setStateRegion(loc.state);
              if (loc.zipCode) setZipCode(loc.zipCode);
            }}
          />
          
          </div>
        </div>

        
        <button className="submit-btn" type="submit">Create Tool</button> 
      </form>

    </div>
  );
};

export default CreateTool;
