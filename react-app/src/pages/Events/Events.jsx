// src/pages/Events/Event.jsx

import React, { useState, useEffect } from "react";
import "./Events.css";
import { getEventsByUser } from "../../services/eventService";
import { useSelector } from "react-redux";
import eventsData from "./eventsData.json";
import { useNavigate } from "react-router";
import SearchBar from "../../components/SearchBar";
import AddIcon from '@mui/icons-material/Add';
import { EVENT_TAGS } from "../../assets/tags";
import EventCards from "./EventCards";

const haversine = require('haversine-distance');

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, {
    month: "long", day: "numeric", year: "numeric"
  });

export const formatTime = (time) => {
  const [h, m] = time.split(":");
  const date = new Date();
  date.setHours(h, m);
  return date.toLocaleTimeString([], {
    hour: "2-digit", minute: "2-digit"
  });
};

const Events = () => {
  const [events, setEvents] = useState([]);
  const { access, user_id } = useSelector((state) => state.auth);
  const { latitude, longitude, neighborhood } = useSelector((state) => state.auth);
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
      alert("Successfully registered for the event!");

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

      if (response.data.length > 0) {
        let newData = [];
        response.data.forEach((event) => {
          if ((event["visibility"] === "neighborhood" && event["neighborhood"] === neighborhood) || event["visibility"] !== "neighborhood") {
            newData.push(event);
          } 
        });
        
        setEvents(newData);
        console.log("Fetched events:", newData);
      }
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
          <button 
            className="create-event-button-new" 
            onClick={() => navigate("/create-event")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            Create
          </button>
        </div>
        <EventCards eventCards={events}/>
      </div>
    </div>
  );
};

export default Events;
