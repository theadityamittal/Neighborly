import React, { useState } from "react";
import axios from "axios";
import "../petitions.css";

const CreatePetition = ({ setNewPetition, refreshPetitions }) => {
  const [submitError, setSubmitError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    image_url: "",
    tags: "",
    petition_author: "",
    petition_date: "",
    voting_ends_at: "",
    target_signatures: "",
    description: "",
    hero_image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    setSuccessMessage(null);

    try {
      const token = localStorage.getItem("token");
      const tagsList = formData.tags.split(",").map(tag => tag.trim());

      const payload = {
        title: formData.title,
        location: formData.location,
        organizer_id: formData.petition_author,
        description: formData.description,
        voting_ends_at: formData.voting_ends_at,
        target: parseInt(formData.target_signatures),
        tags: tagsList,
        provider: "Anonymous",
        hero_image: formData.hero_image || "https://source.unsplash.com/featured/?nature,protest"
      };

      const res = await axios.post("http://localhost:8000/petitions/createPetition/", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setSuccessMessage("🎉 Petition created successfully!");

      setFormData({
        title: "",
        location: "",
        image_url: "",
        tags: "",
        petition_author: "",
        petition_date: "",
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
      setSubmitError(err.response?.data?.detail || "Something went wrong while creating the petition.");
    }
  };

  return (
    <div className="create-petition-page">
      <button className="back-btn" onClick={() => setNewPetition(false)}>
        ← Back to Petitions
      </button>
      <div className="form-container">
        <h1 className="form-title">Create New Petition</h1>

        {/* ✅ Feedback Messages */}
        {submitError && (
          <div className="message error-message">{submitError}</div>
        )}
        {successMessage && (
          <div className="message success-message">{successMessage}</div>
        )}

        <label className="input-label">Title</label>
        <input className="input" name="title" value={formData.title} onChange={handleChange} placeholder="Petition Title" />

        <label className="input-label">Location</label>
        <input className="input" name="location" value={formData.location} onChange={handleChange} placeholder="Location" />

        <label className="input-label">Image URL</label>
        <input className="input" name="image_url" value={formData.image_url} onChange={handleChange} placeholder="Image URL" />

        <label className="input-label">Tags</label>
        <input className="input" name="tags" value={formData.tags} onChange={handleChange} placeholder="Enter tags separated by commas" />

        <label className="input-label">Petition Author</label>
        <input className="input" name="petition_author" value={formData.petition_author} onChange={handleChange} placeholder="Author Name" />

        <label className="input-label">Petition Date</label>
        <input className="input" name="petition_date" type="date" value={formData.petition_date} onChange={handleChange} />

        <label className="input-label">Voting Ends At</label>
        <input className="input" name="voting_ends_at" type="date" value={formData.voting_ends_at} onChange={handleChange} />

        <label className="input-label">Target Signatures</label>
        <input className="input" name="target_signatures" type="number" value={formData.target_signatures} onChange={handleChange} placeholder="Target number of signatures" />

        <label className="input-label">Detailed Description</label>
        <textarea className="textarea" name="description" value={formData.description} onChange={handleChange} placeholder="Enter the detailed description of your petition..." />

        <label className="input-label">Hero Image URL</label>
        <input className="input" name="hero_image" value={formData.hero_image} onChange={handleChange} placeholder="Hero Image URL" />

        <button className="submit-btn" onClick={handleSubmit}>Create Petition</button>
      </div>
    </div>
  );
};

export default CreatePetition;