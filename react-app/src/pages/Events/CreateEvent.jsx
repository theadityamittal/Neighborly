import React from "react";

const CreateEvent = ({ onBack }) => {
  return (
    <div className="create-event-page">
      <button className="back-btn" onClick={onBack}>← Back to Events</button>
      <div className="form-container">
        <h1 className="form-title">Create New Event</h1>

        <label className="input-label">Title</label>
        <input className="input" placeholder="Event Title" />

        <label className="input-label">Provider</label>
        <input className="input" placeholder="Provider" />

        <label className="input-label">Location</label>
        <input className="input" placeholder="Location" />

        <label className="input-label">Date</label>
        <input className="input" type="date" />

        <label className="input-label">Image URL</label>
        <input className="input" placeholder="Image URL" />

        <label className="input-label">Description</label>
        <textarea className="textarea" placeholder="Write a short description..." />

        <button className="submit-btn">Create Event</button>
      </div>

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
