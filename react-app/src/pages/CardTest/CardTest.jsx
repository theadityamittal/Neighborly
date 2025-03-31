import React, { useState } from "react";
import HorizontalCard from "../../components/HorizontalCard/HorizontalCard";
import './CardTest.css';

function CardTest() {
  const [selectedCardId, setSelectedCardId] = useState(null);

  const fakeData = [
        {
          id: "1",
          title: "Premium Yoga Class",
          provider: "Zen Studio",
          location: "Los Angeles, CA",
          closestAvailability: "March 20, 2025",
          image: "https://placehold.co/100x100",
          viewType: "card",
          tabs: ["Yoga", "Fitness"],
        },
        {
          id: "2",
          title: "Gourmet Cooking Workshop",
          provider: "MasterChef Academy",
          location: "New York, NY",
          closestAvailability: "April 5, 2025",
          image: "https://placehold.co/100x100",
          viewType: "card",
          tabs: ["Cooking", "Food"],
        },
        {
          id: "3",
          title: "Photography Bootcamp",
          provider: "Creative Lens Studio",
          location: "Chicago, IL",
          closestAvailability: "April 12, 2025",
          image: "https://placehold.co/100x100",
          viewType: "card",
          tabs: ["Photography", "Art"],
        },
        {
          id: "4",
          title: "Digital Marketing Course",
          provider: "Online Academy",
          location: "San Francisco, CA",
          closestAvailability: "March 25, 2025",
          image: "https://placehold.co/100x100",
          viewType: "card",
          tabs: ["Marketing", "Business"],
        },
        {
          id: "5",
          title: "Pilates Training Session",
          provider: "Wellness Hub",
          location: "Seattle, WA",
          closestAvailability: "April 8, 2025",
          image: "https://placehold.co/100x100",
          viewType: "card",
          tabs: ["Pilates", "Fitness"],
        },
        {
            id: "6",
            title: "Tree Climbing Workshop",
            provider: "Adventure Club",
            location: "Denver, CO",
            closestAvailability: "April 15, 2025",
            image: "https://placehold.co/100x100",
            viewType: "card",
            tabs: ["Adventure", "Fitness"],
          },
      ];
  
      const selectedHorizontalCard = fakeData.find(item => item.id === selectedCardId);

  const handleClose = () => setSelectedCardId(null);

  return (
    <div className="test-container">
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        {fakeData.map((item) => (
          <HorizontalCard
            key={item.id}
            {...item}
            onView={() => setSelectedCardId(item.id)}
          />
        ))}
      </div>

      {/* Modal Popup showing the same HorizontalCard data */}
      {selectedHorizontalCard && (
        <div className="modal-overlay" onClick={handleClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleClose}>×</button>
            <HorizontalCard {...selectedHorizontalCard} />
          </div>
        </div>
      )}
    </div>
  );
}

export default CardTest;