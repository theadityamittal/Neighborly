import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const CreateTool = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [earliestAvailability, setEarliestAvailability] = useState('');
  const [image, setImage] = useState(null);
  const [waitlist, setWaitlist] = useState('');
  const { name, user_id, access } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleToolSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tool_owner', user_id);  // Logged-in user's ID for the tool owner
    formData.append('location', location);
    formData.append('date_posted', new Date().toISOString());  // Current date
    formData.append('price', price);
    formData.append('waitlist', JSON.stringify(waitlist.split(',')));  // Convert waitlist to JSON
    if (image) formData.append('image', image);  // Image upload

    try {
      const response = await axiosInstance.post("/tools/api/create/", formData, {
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Tool created successfully!");
      navigate("/tools"); // Navigate back to the Tools page after creation
    } catch (error) {
      console.error("Error creating tool:", error);
    }
  };

  return (
    <div className="create-tool-page">
      <button className="back-btn" onClick={() => navigate("/tools")}>← Back to Tools</button>
      <form className="form-container" encType="multipart/form-data" onSubmit={handleToolSubmit}>
        <h1 className="form-title">Create New Tool</h1>

        <label className="input-label">Title</label>
        <input className="input" placeholder="Tool Title" value={title} onChange={(e) => setTitle(e.target.value)} />

        <label className="input-label">Location</label>
        <input className="input" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />

        <label className="input-label">Earliest Availability</label>
        <input className="input" type="date" value={earliestAvailability} onChange={(e) => setEarliestAvailability(e.target.value)} />

        <label className="input-label">Description</label>
        <textarea className="textarea" placeholder="Write a short description..." value={description} onChange={(e) => setDescription(e.target.value)} />

        <label className="input-label">Image Upload</label>
        <input className="input" type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />

        <button className="submit-btn" type="submit">Create Tool</button>
      </form>

      <style>{`
        .create-tool-page {
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
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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

export default CreateTool;
