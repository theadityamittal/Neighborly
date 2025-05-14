import React, { useState, useEffect } from "react";
import "./HorizontalCardModal.css";
import axiosInstance from "../../utils/axiosInstance"; 
import CalendarPicker from "../CalendarPicker/CalendarPicker";

const HorizontalCardModal = ({ isOpen, onClose, item, type, api_key, description="", toggleOffPrices=false, toggleOffDates=false, toggleOffRequest=false,  handleCustomAPICall= null }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [message, setMessage] = useState(null);
  const [price, setPrice] = useState(null);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    setPrice(item?.price || "");
    setStartDate(item?.start_date || null);
    setEndDate(item?.end_date || null);
    setMessage(item?.message || "");
    setGallery([].concat(item.images || item.image || []));
  }, [item]);

  if (!isOpen || !item) return null;

  // const handleRSVP = async (e) => {
  //   e.preventDefault();
   
  //   // Dynamically resolve the item ID key (e.g., service_id, event_id, etc.)
  //   const idKey = `${type}_id`;
  //   const itemId = item?.[idKey]

  //   console.log("Item ID:", item);
  
  //   if (!itemId || !type) {
  //     alert("Invalid item or type.");
  //     return;
  //   }
  //   const url = `${process.env.REACT_APP_BACKEND_URL}/${type}s/${itemId}/${api_key}/`;
  //   // const url = `${process.env.REACT_APP_BACKEND_URL}/${type}s/${itemId}/signup/`;
  //   console.log("RSVP URL:", url);
  
  //   try {
  //     const response = await axiosInstance.post(url, {
  //       // start_date: startDate?.toISOString().split("T")[0], // "YYYY-MM-DD"
  //       // end_date: endDate?.toISOString().split("T")[0],
  //       start_date: new Date(startDate).toISOString().split("T")[0],
  //       end_date: new Date(endDate).toISOString().split("T")[0],
  //       messages: message,
  //       price: price,
  //     });
  //     console.log("Submitting RSVP with:", {
  //       // start_date: startDate?.toISOString().split("T")[0],
  //       // end_date: endDate?.toISOString().split("T")[0],
  //       start_date: new Date(startDate).toISOString().split("T")[0],
  //       end_date: new Date(endDate).toISOString().split("T")[0],
  //       messages: message,
  //       price: price
  //     });
  //     console.log("axios response:", response);
  //     if (response.status !== 201) {
  //       throw new Error("RSVP failed");
  //     }

  //     alert("RSVP successful!");
  //     console.log("RSVP response:", response.data);
  //   } catch (err) {
  //     console.error("RSVP error:", err);
  //     alert("Failed to submit RSVP.");
  //   }
  //   };

  const handleRSVP = async (e) => {
    e.preventDefault();
    
    // Check if dates are required and not null
    if (!toggleOffDates && (!startDate || !endDate)) {
      alert("Please select both start and end dates.");
      return;
    }
   
    // Dynamically resolve the item ID key (e.g., service_id, event_id, etc.)
    const idKey = `${type}_id`;
    const itemId = item?.[idKey];
  
    console.log("Item ID:", item);
  
    if (!itemId || !type) {
      alert("Invalid item or type.");
      return;
    }
    
    const url = `${process.env.REACT_APP_BACKEND_URL}/${type}s/${itemId}/${api_key}/`;
    console.log("RSVP URL:", url);
  
    try {
      const response = await axiosInstance.post(url, {
        start_date: startDate ? new Date(startDate).toISOString().split("T")[0] : undefined,
        end_date: endDate ? new Date(endDate).toISOString().split("T")[0] : undefined,
        messages: message,
        price: price,
      });
      
      console.log("Submitting RSVP with:", {
        start_date: startDate ? new Date(startDate).toISOString().split("T")[0] : undefined,
        end_date: endDate ? new Date(endDate).toISOString().split("T")[0] : undefined,
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

  return (
    <div className="horizontal-modal-overlay" onClick={onClose}>
      <div className={`horizontal-modal-content ${item.provider_details.account_type==="NGO" ? 'ngo-modal' : ''}`} onClick={(e) => e.stopPropagation()}>
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
          {gallery.length >= 1 ? (
            <img
              src={gallery[0]}
              alt={item.title}
            />
          ) : null}
        </div>
        
        {/* Details Section */}
        <div className="modal-details">
          {/* Combined Information Line */}
            <div className="modal-info-line">
            <span className="modal-provider">{item.provider_details.name}</span>
            <span className="modal-location">
                <span className="location-icon">📍</span> {item.location}
            </span>
            {toggleOffPrices ? <></>:
            <span className="modal-price">
                <span className="price-icon">💲</span> {item.price}
            </span>
            }
            </div>
          {toggleOffDates ? <></>:
          <p className="modal-availability">
            <strong>Closest Availability:</strong> {item.closestAvailability}
          </p>
          }          
          
          {/* Offer Price Field */}
          {toggleOffPrices ? <></>:
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
          }
          
          {/* Date Picker Row */}
          {toggleOffDates ? <></>:
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
          }
          
          {/* Request Message Field */}
          {toggleOffRequest ? <></>:
          <label className="modal-field">
            <strong>Request Message</strong><br />
            <textarea
              className="horizontal-modal-textarea"
              placeholder="Write a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </label>
          }
          {description !== "" ? 
          <label className="modal-field">
            <strong>Description</strong>
            <div style={{fontSize: 16}}>
              {description}
            </div>
          </label>
          :
          <></>
          }
          <button onClick={handleCustomAPICall ? handleCustomAPICall : handleRSVP} className="horizontal-modal-button">
            {handleCustomAPICall ? "Sign Up" : "RSVP" }
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default HorizontalCardModal;