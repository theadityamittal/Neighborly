// src/pages/Events/Event.jsx

import React, { useState, useEffect } from "react";
import "./Events.css";
import HorizontalCard from "../../components/HorizontalCard/HorizontalCard";
import { getEventsByUser } from "../../services/eventService";
import { useSelector } from "react-redux";
import eventsData from "./eventsData.json";
import { useNavigate } from "react-router";

const Modal = ({ event, onClose }) => {
  if (!event) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2 className="modal-title">{event.event_name}</h2>
        <p><strong>Organizer:</strong> {event.organizer_name}</p>
        <p><strong>Location:</strong> {event.location}</p>
        <p><strong>Starts:</strong> {formatDate(event.date)} at {formatTime(event.time)}</p>
        <p className="modal-description">{event.description}</p>
        <div className="modal-tags">
          {event.tags?.map((tag, idx) => (
            <span key={idx} className="modal-tag">{tag}</span>
          ))}
          <span className="modal-tag visibility">{event.visibility}</span>
        </div>
      </div>
    </div>
  );
};

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, {
    month: "long", day: "numeric", year: "numeric"
  });

const formatTime = (time) => {
  const [h, m] = time.split(":");
  const date = new Date();
  date.setHours(h, m);
  return date.toLocaleTimeString([], {
    hour: "2-digit", minute: "2-digit"
  });
};

const Events = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { access, user_id } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      // ▶️ LOCAL MOCK: uncomment to use
      // setEvents(eventsData);
      // return;

      try {
        const response = await getEventsByUser({ organizer_id: user_id }, access);
        setEvents(response.data);
      } catch (err) {
        console.error(err);
        // fallback to local data
        setEvents(eventsData);
      }
    };
    fetchData();
  }, [access, user_id]);

  return (
    <div className="events-page">
      <>
        <div className="events-header">
          <h2>Upcoming Events</h2>
          <button
            onClick={() => navigate("/create-event")}
            className="create-event-btn"
          >
            + Create Event
          </button>
        </div>
        <div className="events-list">
          {events.map((event) => (
            <div key={event.event_id} className="events-item">
              <HorizontalCard
                id={event.event_id}
                title={event.event_name}
                provider={event.organizer_name}
                location={
                  <span>
                    {event.location}
                    {event.location_link && (
                      <a
                        href={event.location_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open in Maps"
                      >
                        📍
                      </a>
                    )}
                  </span>
                }
                closestAvailability={`${formatDate(event.date)} at ${formatTime(event.time)}`}
                image={event.image}
                tabs={[...(event.tags || []), event.visibility]}
                viewType="card"
                onView={() => setSelectedEvent(event)}
              />
            </div>
          ))}
        </div>
      </>
      <Modal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
};

export default Events;
