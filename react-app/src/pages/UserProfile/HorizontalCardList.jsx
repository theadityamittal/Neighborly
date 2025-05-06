import React from "react";
import HorizontalCard from "../../components/HorizontalCard/HorizontalCard";
import { useNavigate } from "react-router";

const HorizontalCardList = ({ items, viewRouteBase, onView = null }) => {
  const navigate = useNavigate();

  const handleView = (item) => {
    if (onView) {
      onView(item);  // Call the passed onView (for modal or details)
    } else {
      navigate(`/${viewRouteBase}/${item.id || item.event_id}`);  // Default navigation
    }
  };

  if (!items || items.length === 0) {
    return (
      <div style={{
        width: '100%',
        textAlign: 'center',
        fontSize: '18px',
        color: '#555',
        marginTop: '20px'
      }}>
        No items to display.
      </div>
    );
  }

  return (
    <div className="horizontal-card-list">
      {items.map((item) => (
        <div key={item.id || item.event_id} style={{ marginBottom: '20px' }}>
          <HorizontalCard
            id={item.id || item.event_id}
            title={item.title || item.event_name}
            provider={item.provider || item.organizer_name}
            location={item.location}
            closestAvailability={item.closestAvailability}
            image={item.image}
            tabs={item.tags ? [...item.tags, item.visibility] : [item.visibility]}
            onView={() => handleView(item)}
          />
        </div>
      ))}
    </div>
  );
};

export default HorizontalCardList;