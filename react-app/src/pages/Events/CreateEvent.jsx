// src/pages/Events/CreateEvent.jsx

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { uploadEvent } from "../../services/eventService";
import { useNavigate } from "react-router-dom";
import "./CreateEvent.css";

const CreateEvent = () => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const { name, user_id, access } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleEventSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("event_name", title);
    formData.append("organizer_name", name);
    formData.append("organizer_id", user_id);
    formData.append("location", location);
    formData.append("date", date);
    formData.append("time", time);
    formData.append("description", description);
    formData.append("visibility", "public");
    formData.append("tags", JSON.stringify([]));
    formData.append("recurring", false);
    formData.append("image", image);

    try {
      const response = await uploadEvent(formData, access);
      console.log("Created Event successfully:", response.data);
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

        <label className="input-label">Title</label>
        <input
          className="input"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="input-label">Location</label>
        <input
          className="input"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
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

        <button className="submit-btn" type="submit">
          Create Event
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
