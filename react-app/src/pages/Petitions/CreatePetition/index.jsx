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
} from "@mui/material";
import "../petitions.css";
import { PETITION_TAGS } from "../../../assets/tags";

const CreatePetition = ({ setNewPetition, refreshPetitions }) => {
  const [submitError, setSubmitError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();
  const { access, user_id, name } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    tags: [],
    voting_ends_at: "",
    target_signatures: "",
    description: "",
    hero_image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      tags: event.target.value,
    }));
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    setSuccessMessage(null);

    try {
      const payload = {
        title: formData.title,
        location: formData.location,
        organizer_id: user_id,
        provider: name,
        description: formData.description,
        voting_ends_at: formData.voting_ends_at,
        target: parseInt(formData.target_signatures, 10),
        tags: formData.tags,
        hero_image:
          formData.hero_image ||
          "https://source.unsplash.com/featured/?nature,protest",
      };

      await axiosInstance.post("/petitions/createPetition/", payload, {
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-Type": "application/json",
        },
      });

      setSuccessMessage("🎉 Petition created successfully!");
      if (refreshPetitions) refreshPetitions();

      setFormData({
        title: "",
        location: "",
        tags: [],
        voting_ends_at: "",
        target_signatures: "",
        description: "",
        hero_image: "",
      });

      setTimeout(() => {
        setNewPetition(false);
      }, 2000);
    } catch (err) {
      console.error("Error creating petition:", err.response?.data || err.message);
      setSubmitError(
        err.response?.data?.detail || "Something went wrong creating the petition."
      );
    }
  };

  return (
    <div className="create-petition-page">
      <button className="back-btn" onClick={() => navigate("/petitions")}>
        ← Back to Petitions
      </button>

      <div className="form-container">
        <h1 className="form-title">Create New Petition</h1>

        {submitError && <div className="message error-message">{submitError}</div>}
        {successMessage && (
          <div className="message success-message">{successMessage}</div>
        )}

        <label className="input-label">Title</label>
        <input
          className="input"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Petition Title"
        />

        <label className="input-label">Location</label>
        <input
          className="input"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
        />

        <FormControl fullWidth margin="normal">
          <InputLabel id="tags-label">Tags</InputLabel>
          <Select
            labelId="tags-label"
            multiple
            value={formData.tags}
            onChange={handleTagChange}
            renderValue={(selected) => selected.join(", ")}
          >
            {PETITION_TAGS.map((tag) => (
              <MenuItem key={tag} value={tag}>
                <Checkbox checked={formData.tags.includes(tag)} />
                <ListItemText primary={tag} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <label className="input-label">Voting Ends At</label>
        <input
          className="input"
          name="voting_ends_at"
          type="date"
          value={formData.voting_ends_at}
          onChange={handleChange}
        />

        <label className="input-label">Target Signatures</label>
        <input
          className="input"
          name="target_signatures"
          type="number"
          value={formData.target_signatures}
          onChange={handleChange}
          placeholder="Target number of signatures"
        />

        <label className="input-label">Detailed Description</label>
        <textarea
          className="textarea"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter the detailed description of your petition..."
        />

        <label className="input-label">Hero Image URL</label>
        <input
          className="input"
          name="hero_image"
          value={formData.hero_image}
          onChange={handleChange}
          placeholder="Hero Image URL"
        />

        <button className="submit-btn" onClick={handleSubmit}>
          Create Petition
        </button>
      </div>
    </div>
  );
};

export default CreatePetition;