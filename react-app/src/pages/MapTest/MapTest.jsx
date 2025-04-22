import React, { useState } from 'react';
import LocationPicker from "../../components/LocationPicker/LocationPicker";


const DummyServiceForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    latitude: null,
    longitude: null,
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted data:", formData);
    // You can now send this to your backend API
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "600px", margin: "auto" }}>
      <h2>Create a Service</h2>

      <label>Title</label>
      <input
        name="title"
        type="text"
        value={formData.title}
        onChange={handleChange}
        required
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <label>Description</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
        rows={4}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <label>Select Location (Search or Drag)</label>
      <LocationPicker
        onLocationChange={({ latitude, longitude, locationName }) => {
            setFormData((prev) => ({
            ...prev,
            latitude,
            longitude,
            location_name: locationName,
            }));
        }}
        />

      <br />
      <button type="submit" disabled={!formData.latitude || !formData.longitude}>
        Submit
      </button>
    </form>
  );
};

export default DummyServiceForm;