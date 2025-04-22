import React, { useState, useEffect } from "react";
import "./HorizontalCardModal.css";
import axiosInstance from "../../utils/axiosInstance"; 
import CalendarPicker from "../CalendarPicker/CalendarPicker";

const HorizontalCardModal = ({ isOpen, onClose, item, type, api_key }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [message, setMessage] = useState(null);
  const [price, setPrice] = useState(null);

  useEffect(() => {
    setPrice(item?.price || "");
  }, [item]);

  if (!isOpen || !item) return null;

  const handleRSVP = async (e) => {
    e.preventDefault();
   
    // Dynamically resolve the item ID key (e.g., service_id, event_id, etc.)
    const idKey = `${type}_id`;
    const itemId = item?.[idKey]

    console.log("Item ID:", item);
  
    if (!itemId || !type) {
      alert("Invalid item or type.");
      return;
    }
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/${type}s/${itemId}/${api_key}/`;
    // const url = `${process.env.REACT_APP_BACKEND_URL}/api/${type}s/${itemId}/signup/`;
    console.log("RSVP URL:", url);
  
    try {
      const response = await axiosInstance.post(url, {
        // start_date: startDate?.toISOString().split("T")[0], // "YYYY-MM-DD"
        // end_date: endDate?.toISOString().split("T")[0],
        start_date: new Date(startDate).toISOString().split("T")[0],
        end_date: new Date(endDate).toISOString().split("T")[0],
        messages: message,
        price: price,
      });
      console.log("Submitting RSVP with:", {
        // start_date: startDate?.toISOString().split("T")[0],
        // end_date: endDate?.toISOString().split("T")[0],
        start_date: new Date(startDate).toISOString().split("T")[0],
        end_date: new Date(endDate).toISOString().split("T")[0],
        messages: message,
        price: price
      });
      console.log("axios response:", response);
      if (response.status !== 201) {
        throw new Error("RSVP failed");
      }

      alert("RSVP successful!");
      console.log("RSVP response:", response.data);
    } catch (err) {
      console.error("RSVP error:", err);
      alert("Failed to submit RSVP.");
    }
    };

  // Use item.images if available; otherwise, fallback to a single image.
  const galleryImages =
    item.images && item.images.length ? item.images : [item.image];

  return (
    <div className="horizontal-modal-overlay" onClick={onClose}>
      <div className="horizontal-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="horizontal-modal-close" onClick={onClose}>×</button>
        
        {/* Title Section */}
        <h2 className="modal-title">{item.title}</h2>
        {/* Tabs Section */}
        {item.tabs && item.tabs.length > 0 && (
            <div className="horizontal-card-tabs">
                {item.tabs.map((tag, index) => (
                <div key={index} className="horizontal-card-tab">
                    {tag}
                </div>
                ))}
            </div>
            )}

        {/* Gallery Section */}
        <div className="modal-gallery">
          {galleryImages.map((img, index) => (
            <img key={index} src={img} alt={`${item.title} ${index + 1}`} />
          ))}
        </div>
        
        {/* Details Section */}
        <div className="modal-details">
          {/* Combined Information Line */}
            <div className="modal-info-line">
            <span className="modal-provider">{item.provider}</span>
            <span className="modal-location">
                <span className="location-icon">📍</span> {item.location}
            </span>
            <span className="modal-price">
                <span className="price-icon">💲</span> {item.price}
            </span>
            </div>
          
          <p className="modal-availability">
            <strong>Closest Availability:</strong> {item.closestAvailability}
          </p>
          
          {/* Offer Price Field */}
          <label className="modal-field">
            <strong>Offer Price</strong><br />
            <input
              type="number"
              className="horizontal-modal-input"
              placeholder="$"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </label>
          
          {/* Date Picker Row */}
          <div className="date-picker-row">
            <div className="date-picker-column">
                <strong>From</strong>
                <CalendarPicker 
                selectedDate={startDate}
                onSelect={setStartDate}
                unavailableDates={item.unavailableDates}
                disableBeforeToday={item.disableBeforeToday}
                />
            </div>
            <div className="date-picker-column">
                <strong>To</strong>
                <CalendarPicker 
                selectedDate={endDate}
                onSelect={setEndDate}
                unavailableDates={item.unavailableDates}
                disableBeforeToday={item.disableBeforeToday}
                minDate={startDate} // Disable dates before the start date
                />
            </div>
            </div>
          
          {/* Request Message Field */}
          <label className="modal-field">
            <strong>Request Message</strong><br />
            <textarea
              className="horizontal-modal-textarea"
              placeholder="Write a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </label>
          
          <button onClick={handleRSVP} className="horizontal-modal-button">
            RSVP
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default HorizontalCardModal;