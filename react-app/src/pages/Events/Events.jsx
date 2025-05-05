// src/pages/Events/Event.jsx

import React, { useState, useEffect } from "react";
import "./Events.css";
import HorizontalCard from "../../components/HorizontalCard/HorizontalCard";
import { getEventsByUser } from "../../services/eventService";
import { useSelector } from "react-redux";
import eventsData from "./eventsData.json";
import { useNavigate } from "react-router";
import SearchBar from "../../components/SearchBar";
import AddIcon from '@mui/icons-material/Add';
import HorizontalCardModal from "../../components/HorizontalCard/HorizontalCardModal";
import axiosInstance from "../../utils/axiosInstance";
import { EVENT_TAGS } from "../../assets/tags";

const haversine = require('haversine-distance');

const eventsTags = [
  "Gardening",
  "Construction",
  "Household",
  "Electronics",
  "Sports",
  "Camping",
  "Photography",
  "Art",
  "Cooking"
];

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
  const { latitude, longitude } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleClose = () => {
    setSelectedEvent(null);
  };

  const handleSubmit = async (event_id) => {
    try {
      const response = await axiosInstance.post(`/events/signups/signup_event/`,{ event_id: event_id  }, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
    } catch (error) {
      console.error("Error signing up for event:", error);
    }
  }

  const fetchEvents = async () => {
    // ▶️ LOCAL MOCK: uncomment to use
    // setEvents(eventsData);
    // return;

    try {
      const response = await getEventsByUser({ organizer_id: user_id }, access);
      setEvents(response.data);
      console.log("Fetched events:", response.data);
    } catch (err) {
      console.error(err);
      // fallback to local data
      setEvents(eventsData);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [access, user_id]);

  // Filter events based on search term and tags and radius
  const filterEvents = (searchTerm, {tags, radius}) => {
    const filteredEvents = events.filter((event) => {
      const titleMatch = event.event_name.toLowerCase().includes(searchTerm.toLowerCase());
      const tagsMatch = tags.length === 0 || event?.tags.some(t => tags.includes(t));

      const eventLocation = {
        latitude: event.latitude,
        longitude: event.longitude
      };

      const userLocation = {
        latitude: latitude,
        longitude: longitude
      };
      
      const distance = haversine(eventLocation, userLocation) / 1000;

      const withinRadius = radius === 0 || distance <= radius;

      return titleMatch && tagsMatch && withinRadius;
    })
    setEvents(filteredEvents);
  }

  const resetEvents = () => {
    setSearchTerm("");
    fetchEvents();
  }

  return (
    <div className="events-page">
      <div>
        <div className="events-header">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} filterActiveContent={filterEvents} resetFilter={resetEvents} tagOptions={EVENT_TAGS}/>
          <div className="events-header-btn" onClick={() => navigate("/create-event")}>
            <AddIcon fontSize="large"/>
          </div>
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
      </div>
      {selectedEvent && (
        <HorizontalCardModal
          isOpen={!!selectedEvent}
          toggleOffPrices={true}
          toggleOffDates={true}
          toggleOffRequest={true}
          description={selectedEvent.description}
          onClose={handleClose}
          item={selectedEvent}
          type="events"  // must match your API prefix if used
          api_key=""
          handleCustomAPICall={() => handleSubmit(selectedEvent.event_id)}
        />
      )}
    </div>
  );
};

export default Events;
