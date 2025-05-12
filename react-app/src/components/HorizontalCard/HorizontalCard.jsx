import './HorizontalCard.css';
import Button from '../Button/Button';
import { FaCheckCircle, FaHeart } from 'react-icons/fa';

function HorizontalCard({
  id,
  title,
  provider,
  location,
  closestAvailability = "",
  image,
  tabs,
  viewType,
  onView, // this is passed from CardTest to trigger showing VerticalCard
  changeButtonName = "View",
  isNGO = false,
}) {
  const handleClick = () => {
    console.log(`You clicked on card ID: ${id}`);
    if (onView) {
      onView(); // this will call setSelectedCardId(id) in CardTest
    }
  };

  return (
    // <div className="horizontal-card">
    <div className={`horizontal-card ${isNGO ? 'ngo-card' : ''}`}>
      <img className="horizontal-card-image" src={image} alt={title} />
      <div className="horizontal-card-content">
        {/* Tags */}
        <div className="horizontal-card-tabs">
          {tabs && tabs.map((item, index) => (
            <div key={index} className="horizontal-card-tab">
              {item}
            </div>
          ))}
        </div>

        {/* Main Info */}
        <div className="horizontal-card-title">{title}</div>
        <div className="horizontal-card-provider">
  
          {provider}
          
        </div>
        <div>{location}</div>

        {/* Availability */}
        {closestAvailability && (
          <div>
            <span style={{ fontWeight: 600 }}>Closest Availability:</span> {closestAvailability}
          </div>
        )}

        {/* View Button */}
        <div className="button-container">
          <Button onClick={handleClick} text={changeButtonName} />
        </div>
      </div>
    </div>
  );
}

export default HorizontalCard;
