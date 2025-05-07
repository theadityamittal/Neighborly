import React from "react";
import './styles.css'; // You'll need to create this CSS file
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Assuming you're using Material UI
import axiosInstance from "../../../utils/axiosInstance";
import { useSelector } from "react-redux";
import HorizontalCardModalEdit from "../../../components/HorizontalCard/HorizontalCardModalEdit";

const DetailedEvent = () => {
  const { event_id } = useParams();
  const [eventDetails, setEventDetails] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [selectedEdit, setSelectedEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { access } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleClose = () => {
    setSelectedEdit(false);
  };

  useEffect(() => {
    const fetchEvent = async () => {

      try {
        const response = await axiosInstance.get(`/events/events/${event_id}/`, {
          headers: {
            Authorization: `Bearer ${access}`,
            "Content-Type": "multipart/form-data",
          }
        });
        console.log(response.data)
        setEventDetails(response.data);

        const response2 = await axiosInstance.get(`/events/userlist/${event_id}/`, {
          headers: {
            Authorization: `Bearer ${access}`,
            "Content-Type": "multipart/form-data",
          }
        });
        console.log(response2.data);
        setParticipants(response2.data);
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError("Failed to load event details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [access, event_id]);

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (loading || !eventDetails) {
    return <div className="loading">Loading petition details...</div>;
  }

  return (
    <div className="detailed-event-container">
      <div className="event-header">
        <button className="back-button" onClick={() => navigate("/profile")}>
          <ArrowBackIcon /> Back
        </button>
        <div className="event-tags">
          {eventDetails.tags && eventDetails.tags.map((tag, index) => (
            <span key={index} className="event-tag">{tag}</span>
          ))}
        </div>
      </div>
      <h1 className="event-title">{eventDetails.event_name}</h1>
      <div className="event-content">
        <div className="event-main-info">
          <div className="event-author">
            <span className="meta-label">Created by:</span> {eventDetails.organizer_name}
          </div>
          <div className="event-hero">
            <img 
              src={eventDetails.image} 
              alt={eventDetails.event_name} 
              className="event-hero-image"
            />
          </div>
          <div className="event-meta">
            <div className="event-date">
              <span className="meta-label">Date:</span> {eventDetails.date}
            </div>
            <div className="event-location">
              <span className="meta-label">Location:</span> {eventDetails.location}
            </div>
          </div>
          <h2 className="description-title">Description</h2>
          {eventDetails.description}
          <div className="event-description"></div>
        </div>
        <div className="event-description-container">
          <div>
            <h2 className="description-title">List of Participants</h2>
            <p className="event-description">{
              participants.map((participant) => (
                <div>{participant.user.name}</div>

            ))}</p>
          </div>
          <div className="event-cta">
            <button className="sign-event-button" onClick={() => setSelectedEdit(!selectedEdit)}>Edit this Event</button>
          </div>
              {selectedEdit && (
            <HorizontalCardModalEdit
              isOpen={!!selectedEdit}
              onClose={handleClose}
              item={{
                image: eventDetails.image,
                description: eventDetails.description,
                title: eventDetails.event_name,
                id: eventDetails.event_id,
                date: eventDetails.date,
                time: eventDetails.time,
                visibility: eventDetails.visibility,
                location: eventDetails.location,
              }}
              type="Event"
              api="events/events"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailedEvent;