import React, { useState } from "react";
import { useSelector } from "react-redux";
import { uploadEvent } from "../../services/eventService";
import { useNavigate } from "react-router-dom";

const CreateEvent = ({ onBack }) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const {name, user_id, access } = useSelector((state) => state.auth);
  const [time, setTime] = useState('');
  const navigate = useNavigate();

  const handleEventSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('event_name', title);
    formData.append('organizer_name', name);
    formData.append('organizer_id', user_id); // Replace with actual logged-in user ID if needed
    formData.append('location', location);
    formData.append('date', date);
    formData.append('description', description);
    formData.append('visibility', 'public'); // Replace if needed
    formData.append('tags', JSON.stringify([])); // Add real tags if needed
    formData.append('recurring', false);
    formData.append('image', image); // Handles file
    formData.append('time', time); // Add time if needed

    try {
      const response = await uploadEvent(formData, access);
      console.log("Created Event successfully:", response.data);
      alert("Event created successfully!");
      onBack();

    } catch (error) {
      console.error("Error updating profile:", error);
    }
  }


  return (
    <div className="create-event-page">
      <button className="back-btn" onClick={onBack}>← Back to Events</button>
      <form className="form-container" encType="multipart/form-data" onSubmit={handleEventSubmit}>

        <h1 className="form-title">Create New Event</h1>

        <label className="input-label">Title</label>
        <input className="input" placeholder="Event Title" value={title} onChange={(e) => setTitle(e.target.value)} />

        <label className="input-label">Location</label>
        <input className="input" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />

        <label className="input-label">Date</label>
        <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />

        <label className="input-label">Time</label>
        <input className="input" type="time" value={time} onChange={(e) => setTime(e.target.value)}/>

        <label className="input-label">Description</label>
        <textarea className="textarea" placeholder="Write a short description..." value={description} onChange={(e) => setDescription(e.target.value)} />

        <label className="input-label">Image Upload</label>
        <input className="input" type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />

        <button className="submit-btn" type="submit">Create Event</button>
      </form>

      <style>{`
        .create-event-page {
          max-width: 1000px;
          margin: 0 auto;
          padding: 40px;
          background-color: #fff;
          font-family: 'Inter', sans-serif;
        }

        .back-btn {
          color: #493CAE;
          background: none;
          border: none;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 20px;
        }

        .form-container {
          display: flex;
          flex-direction: column;
          background-color: #F5F5F5;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .form-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 20px;
          color: #000;
        }

        .input-label {
          font-weight: 600;
          font-size: 14px;
          color: #6D758F;
          margin-top: 20px;
          margin-bottom: 6px;
        }

        .input, .textarea {
          background: #FFFFFF;
          border: 1px solid #F1F3F7;
          box-shadow: 0px 1px 4px rgba(25, 33, 61, 0.08);
          border-radius: 6px;
          padding: 12px;
          font-size: 14px;
          width: 100%;
          box-sizing: border-box;
        }

        .textarea {
          resize: vertical;
          min-height: 80px;
        }

        .submit-btn {
          margin-top: 30px;
          background-color: #493CAE;
          color: #fff;
          border: none;
          padding: 14px 20px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .submit-btn:hover {
          background-color: #3b2e94;
        }
      `}</style>
    </div>
  );
};

export default CreateEvent;
