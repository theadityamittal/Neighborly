import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import FormLocationPicker from "../../components/LocationPicker/FormLocationPicker";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import "./CreateEvent.css";

const CreateEvent = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [image, setImage] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateRegion, setStateRegion] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [location, setLocation] = useState("");
  const { name, user_id, access } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleEventSubmit = async (e) => {
    e.preventDefault();

    if (!latitude || !longitude) {
      alert("Please select a location on the map.");
      return;
    }

    const formData = new FormData();
    formData.append("event_name", title);
    formData.append("organizer_name", name);
    formData.append("organizer_id", user_id);
    formData.append("location", location);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("street_address", streetAddress);
    formData.append("city", city);
    formData.append("state", stateRegion);
    formData.append("zip_code", zipCode);
    formData.append("date", date);
    formData.append("time", time);
    formData.append("description", description);
    formData.append("visibility", visibility);
    formData.append("image", image);

    try {
      const response = await axiosInstance.post("/events/events/", formData, {
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Event created successfully!");
      navigate("/events");
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event.");
    }
  };

  return (
    <div className="create-event-page">
      <button className="back-btn" onClick={() => navigate("/events")}>
        ← Back to Events
      </button>
      <form
        className="form-container"
        encType="multipart/form-data"
        onSubmit={handleEventSubmit}
      >
        <h1 className="form-title">Create New Event</h1>

        <div className="two-column-row">
          {/* Left Column: Form Fields */}
          <div className="form-left">
            <label className="input-label">Title</label>
            <input
              className="input"
              placeholder="Event Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <label className="input-label">Date</label>
            <input
              className="input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <label className="input-label">Time</label>
            <input
              className="input"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />

            <label className="input-label">Description</label>
            <textarea
              className="textarea"
              placeholder="Write a short description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <label className="input-label">Image Upload</label>
            <input
              className="input"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          {/* Right Column: Map Selector and Visibility */}
          <div className="form-right">
            <FormControl className="visibility-control">
              <label className="input-label">Visibility</label>
              <RadioGroup
                row
                aria-labelledby="visibility-group-label"
                name="visibility"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
              >
                <FormControlLabel
                  value="public"
                  control={<Radio />}
                  label="Public"
                />
                <FormControlLabel
                  value="neighborhood"
                  control={<Radio />}
                  label="Neighborhood Only"
                />
                <FormControlLabel
                  value="invitation"
                  control={<Radio />}
                  label="Invitation Only"
                />
              </RadioGroup>
            </FormControl>

            <FormLocationPicker
              location={location}
              setLocation={(val) => setLocation(val)}
              onCoordinatesChange={(loc) => {
                setLatitude(loc.latitude);
                setLongitude(loc.longitude);
                setStreetAddress(loc.streetAddress);
                setCity(loc.city);
                setStateRegion(loc.state);
                setZipCode(loc.zipCode);
              }}
            />
          </div>
        </div>

        <button className="submit-btn" type="submit">
          Create Event
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;