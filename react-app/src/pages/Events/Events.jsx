import React, { useState, useEffect } from "react";
import HorizontalCard from "../../components/HorizontalCard/HorizontalCard";
import CreateEvent from "./CreateEvent";

// 📍 Modal Component
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
          {event.tags?.map((tag, index) => (
            <span key={index} className="modal-tag">{tag}</span>
          ))}
          <span className="modal-tag visibility">{event.visibility}</span>
        </div>
      </div>
      <style>{`
        .modal-overlay {
          position: fixed; top: 0; left: 0;
          width: 100%; height: 100%;
          background: rgba(0,0,0,0.4);
          display: flex; align-items: center; justify-content: center;
          z-index: 50;
        }
        .modal-content {
          background: white;
          padding: 30px;
          border-radius: 10px;
          max-width: 500px;
          width: 100%;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
          position: relative;
        }
        .modal-close {
          position: absolute; top: 15px; right: 20px;
          font-size: 24px;
          background: none;
          border: none;
          cursor: pointer;
          color: #493CAE;
        }
        .modal-title {
          font-size: 22px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .modal-description {
          margin-top: 10px;
          margin-bottom: 15px;
        }
        .modal-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .modal-tag {
          background: #EEE;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
        }
        .modal-tag.visibility {
          background: #d4c7fa;
          color: #493CAE;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

// 🔧 Utilities
const formatDate = (iso) => new Date(iso).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
const formatTime = (time) => {
  const [h, m] = time.split(":");
  const date = new Date();
  date.setHours(h, m);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const Events = () => {
  const [events, setEvents] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const data = [
      {
        event_id: "ev001",
        event_name: "Community Cleanup Drive",
        organizer_id: "u001",
        organizer_name: "Sarah Liu",
        description: "Join us to clean up Central Park and meet your neighbors!",
        location: "Central Park",
        location_link: "https://maps.google.com/?q=Central+Park",
        date: "2024-03-10",
        time: "09:00",
        visibility: "public",
        tags: ["Environment", "Volunteer"],
      },
      {
        event_id: "ev002",
        event_name: "Neighborhood Potluck",
        organizer_id: "u002",
        organizer_name: "David Martinez",
        description: "Bring a dish and come share stories with the community!",
        location: "Community Center",
        date: "2024-03-12",
        time: "17:30",
        visibility: "invite-only",
        tags: ["Food", "Community"],
      },
      {
        event_id: "ev003",
        event_name: "Youth Coding Workshop",
        organizer_id: "u003",
        organizer_name: "Emma Thompson",
        description: "Empowering teens with hands-on programming skills.",
        location: "Library Room B",
        date: "2024-03-14",
        time: "15:00",
        visibility: "public",
        tags: ["Education", "Technology"],
      },
      {
        event_id: "ev004",
        event_name: "Mental Health Support Circle",
        organizer_id: "u004",
        organizer_name: "Marcus King",
        description: "Open group sharing to support mental wellness.",
        location: "Wellness Center",
        date: "2024-03-15",
        time: "18:00",
        visibility: "private",
        tags: ["Health", "Support"],
      },
      {
        event_id: "ev005",
        event_name: "Art in the Park",
        organizer_id: "u005",
        organizer_name: "Ava Chen",
        description: "An outdoor event for all ages to create art together.",
        location: "Lincoln Park",
        date: "2024-03-16",
        time: "10:30",
        visibility: "public",
        tags: ["Arts", "Community"],
      },
      {
        event_id: "ev006",
        event_name: "Seniors Tech Help",
        organizer_id: "u006",
        organizer_name: "Ethan Patel",
        description: "One-on-one tech assistance for older adults.",
        location: "Community Hub",
        date: "2024-03-17",
        time: "14:00",
        visibility: "public",
        tags: ["Support", "Seniors"],
      },
      {
        event_id: "ev007",
        event_name: "Pet Adoption Weekend",
        organizer_id: "u007",
        organizer_name: "Happy Paws Shelter",
        description: "Find your new furry friend!",
        location: "Main Plaza",
        date: "2024-03-18",
        time: "11:00",
        visibility: "public",
        tags: ["Pets", "Adoption"],
      },
      {
        event_id: "ev008",
        event_name: "Local Music Jam",
        organizer_id: "u008",
        organizer_name: "Liam Nguyen",
        description: "Bring your instruments and vibe out with neighbors.",
        location: "Garage Studio",
        date: "2024-03-19",
        time: "19:00",
        visibility: "public",
        tags: ["Music", "Culture"],
      }
    ];
  
    setEvents(data);
  }, []);
  

  return (
    <div className="p-6 max-w-7xl mx-auto" style={{ paddingLeft: "40px", paddingRight: "40px" }}>
      {!showCreate ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Upcoming Events</h2>
            <button onClick={() => setShowCreate(true)} className="create-event-btn">
              + Create Event
            </button>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {events.map((event) => (
              <div
                key={event.event_id}
                style={{
                  width: "50%",
                  padding: "12px",
                  boxSizing: "border-box",
                }}
              >
                <HorizontalCard
                  id={event.event_id}
                  title={event.event_name}
                  provider={event.organizer_name}
                  location={
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      {event.location}
                      {event.location_link && (
                        <a
                          href={event.location_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: "14px",
                            color: "#493CAE",
                            textDecoration: "none",
                            marginLeft: "4px"
                          }}
                          title="Open in Maps"
                        >
                          📍
                        </a>
                      )}
                    </span>
                  }                  
                  closestAvailability={`${formatDate(event.date)} at ${formatTime(event.time)}`}
                  image={`https://placehold.co/600x400?text=${encodeURIComponent(event.event_name)}`}
                  tabs={[...(event.tags || []), event.visibility]}
                  viewType="card"
                  onView={() => setSelectedEvent(event)}
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <CreateEvent onBack={() => setShowCreate(false)} />
      )}

      <Modal event={selectedEvent} onClose={() => setSelectedEvent(null)} />

      <style>{`
        .create-event-btn {
          background-color: #493CAE;
          color: white;
          padding: 14px 22px;
          font-size: 14px;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          box-shadow: 0px 1px 4px rgba(25, 33, 61, 0.08);
          transition: background-color 0.2s ease;
        }

        .create-event-btn:hover {
          background-color: #3e3191;
        }
      `}</style>
    </div>
  );
};

export default Events;
