import React, { useState, useEffect } from "react";
import HorizontalCard from "../../components/HorizontalCard/HorizontalCard";
import CreateEvent from "./CreateEvent";

const cardWrapperStyle = {
  width: "25%",
  padding: "0 0",
  marginBottom: "24px",
  boxSizing: "border-box",
};

const rowStyle = {
  display: "flex",
  flexWrap: "wrap",
  marginLeft: "-12px",
  marginRight: "-12px",
};

const halfWidth = {
  width: "75%",
  maxWidth: "40%",
};

const halfWidthMd = `
  @media (min-width: 768px) {
    .half-width {
      width: 50%;
    }
  }
`;

const Events = () => {
  const [events, setEvents] = useState([]);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    const fakeData = [
      {
        id: "1",
        title: "Yoga Class",
        provider: "Zen Studio",
        location: "Los Angeles, CA",
        closestAvailability: "March 20, 2025",
        image: "https://placehold.co/25x25",
        tabs: ["Wellness"],
      },
      {
        id: "2",
        title: "Cooking Night",
        provider: "KitchenPro",
        location: "New York, NY",
        closestAvailability: "April 10, 2025",
        image: "https://placehold.co/25x25",
        tabs: ["Food", "Community"],
      },
      {
        id: "3",
        title: "Art Workshop",
        provider: "ArtLab",
        location: "Chicago, IL",
        closestAvailability: "May 1, 2025",
        image: "https://placehold.co/25x25",
        tabs: ["Creativity"],
      },
      {
        id: "4",
        title: "Tech Meetup",
        provider: "DevCon",
        location: "San Francisco, CA",
        closestAvailability: "April 18, 2025",
        image: "https://placehold.co/25x25",
        tabs: ["Technology"],
      },
      {
        id: "5",
        title: "Community Cleanup",
        provider: "GreenEarth",
        location: "Austin, TX",
        closestAvailability: "March 31, 2025",
        image: "https://placehold.co/25x25",
        tabs: ["Environment", "Community"],
      },
      {
        id: "6",
        title: "Wine Tasting",
        provider: "Vino Club",
        location: "Napa Valley, CA",
        closestAvailability: "May 5, 2025",
        image: "https://placehold.co/25x25",
        tabs: ["Food", "Lifestyle"],
      },
    ];
    setEvents(fakeData);
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <style>{halfWidthMd}</style>

      {!showCreate ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Upcoming Events</h2>
            <button
              onClick={() => setShowCreate(true)}
              className="create-event-btn"
            >
              + Create Event
            </button>
          </div>

          <div style={rowStyle}>
            {events.map((event) => (
              <div
                key={event.id}
                className="half-width"
                style={{ ...cardWrapperStyle, ...halfWidth }}
              >
                <HorizontalCard {...event} />
              </div>
            ))}
          </div>
        </>
      ) : (
        <CreateEvent onBack={() => setShowCreate(false)} />
      )}

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
