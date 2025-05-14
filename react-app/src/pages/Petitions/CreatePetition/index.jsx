// src/pages/Petitions/CreatePetition.jsx

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import "../petitions.css";
import { PETITION_TAGS } from "../../../assets/tags";
import FormLocationPicker from "../../../components/LocationPicker/FormLocationPicker";

const CreatePetition = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [image, setImage] = useState(null);
  const [endDate, setEndDate] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [location, setLocation] = useState("");
  const [targetSignatures, setTargetSignatures] = useState("");
  const [tags, setTags] = useState([]);
  const { name, user_id, access } = useSelector((state) => state.auth);
  const [submitError, setSubmitError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSuccessMessage(null);

      // 1) See what React state has
    console.log("state.image =", image);

    // 2) See what the raw input has
    const fileInput = document.querySelector('input[type="file"]');
    console.log("input.files[0] =", fileInput.files[0]);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("organizer_id", user_id);
    formData.append("provider", name);

    formData.append("location", location);
    formData.append("street_address", streetAddress);
    formData.append("city", city);
    formData.append("neighborhood", neighborhood);
    formData.append("zip_code", zipCode);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    
    formData.append("visibility", visibility);
    formData.append("tags", JSON.stringify(tags));
    formData.append("target", parseInt(targetSignatures, 10));
    formData.append("voting_ends_at", endDate);
    if (image) {
      formData.append("hero_image", image, image.name);
    }

    try {
      for (let [key, value] of formData.entries()) {
        console.log("– formData", key, value);
      }
      await axiosInstance.post("/petitions/createPetition/", formData, {
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // setSuccessMessage("🎉 Petition created successfully!");
    } catch (err) {
      console.error("Error creating petition:", err.response?.data || err.message);
      setSubmitError(
        err.response?.data?.detail || "Something went wrong creating the petition."
      );
    }
  };

  if (submitError) {
    return <div className="error">{submitError}</div>;
  }
  if (successMessage) {
    return <div className="success">{successMessage}</div>;
  }

  return (
    <div className="create-petition-page">
      <button className="back-btn" onClick={() => navigate("/petitions")}>
        ← Back to Petitions
      </button>
      <form
        className="form-container"
        encType="multipart/form-data"
        onSubmit={handleSubmit}
      >
        
        <h1 className="form-title">Create New Petition</h1>

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

            <label className="input-label">End Date</label>
            <input
              className="input"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />

            <label className="input-label">Description</label>
            <textarea
              className="textarea"
              placeholder="Write a short description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

          <FormControl fullWidth margin="normal">
            <InputLabel id="tags-label">Tags</InputLabel>
            <Select
              labelId="tags-label"
              multiple
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              renderValue={(selected) => selected.join(", ")}
            >
              {PETITION_TAGS.map((tag) => (
                <MenuItem key={tag} value={tag}>
                  <Checkbox checked={tags.includes(tag)} />
                  <ListItemText primary={tag} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
            <label className="input-label">Target Signatures</label>
            <input
              className="input"
              type="number"
              placeholder="Target Signatures"
              value={targetSignatures}
              onChange={(e) => setTargetSignatures(e.target.value)}
            />
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
                setNeighborhood(loc.neighborhood);
                setZipCode(loc.zipCode);
              }}
            />
          </div>
        </div>

        <button className="submit-btn" type="submit">
          Create Petition
        </button>
      </form>
    </div>
  );
};

export default CreatePetition;