// import React, { useState } from "react";
// import "./HorizontalCardModal.css";
// import CalendarPicker from "../CalendarPicker/CalendarPicker";

// const HorizontalCardModal = ({ isOpen, onClose, item }) => {
//     const [fromDate, setFromDate] = useState(null);
//     const [toDate, setToDate] = useState(null);
//     const [selectedDate, setSelectedDate] = useState(null);

//   if (!isOpen || !item) return null;

//   // Use item.images if available; otherwise, fallback to a single image
//   const galleryImages = item.images && item.images.length ? item.images : [item.image];
//   console.log(item.unavailableDates);
//   return (
//     <div className="horizontal-modal-overlay" onClick={onClose}>
//       <div className="horizontal-modal-content" onClick={(e) => e.stopPropagation()}>
//         <button className="horizontal-modal-close" onClick={onClose}>×</button>
        
//         {/* Title Section */}
//         <h2 className="modal-title">{item.title}</h2>
        
//         {/* Gallery Section */}
//         <div className="modal-gallery">
//           {galleryImages.map((img, index) => (
//             <img key={index} src={img} alt={`${item.title} ${index + 1}`} />
//           ))}
//         </div>
        
//         {/* Details Section */}
//         <div className="modal-details">
//           <p className="modal-provider"><strong>{item.provider}</strong></p>
//           <p className="modal-location">{item.location}</p>
//           <p className="modal-price"><strong>$7 / Day</strong></p>
//           <p className="modal-availability">
//             <strong>Closest Availability:</strong> {item.closestAvailability}
//           </p>
          
//           {/* Offer Price Field */}
//           <label className="modal-field">
//             <strong>Offer Price</strong><br />
//             <input type="number" className="horizontal-modal-input" placeholder="$" />
//           </label>
          
//           {/* Calendar Picker replacing standard date inputs */}
//           {/* <div className="modal-field">
//             <strong>Select Date</strong>
//             <CalendarPicker 
//               unavailableDates={item.unavailableDates}
//               selectedDate={selectedDate}
//               onSelect={setSelectedDate}
//               disableBeforeToday={item.disableBeforeToday}
//             />
//           </div> */}
//           {/* Date Picker Row */}
//           <div className="date-picker-row">
//             <div className="modal-field">
//               <strong>From</strong><br />
//               <CalendarPicker 
//                 selectedDate={fromDate}
//                 onSelect={setFromDate}
//                 unavailableDates={item.unavailableDates}
//                 disableBeforeToday={item.disableBeforeToday}
//               />
//             </div>
//             <div className="modal-field">
//               <strong>To</strong><br />
//               <CalendarPicker 
//                 selectedDate={toDate}
//                 onSelect={setToDate}
//                 unavailableDates={item.unavailableDates}
//                 disableBeforeToday={item.disableBeforeToday}
//               />
//             </div>
//           </div>
          
//           {/* Request Message Field */}
//           <label className="modal-field">
//             <strong>Request Message</strong><br />
//             <textarea className="horizontal-modal-textarea" placeholder="Write a message..." />
//           </label>
          
//           <button className="horizontal-modal-button">RSVP</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HorizontalCardModal;

import React, { useState } from "react";
import "./HorizontalCardModal.css";
import CalendarPicker from "../CalendarPicker/CalendarPicker";

const HorizontalCardModal = ({ isOpen, onClose, item }) => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  if (!isOpen || !item) return null;

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
            <input type="number" className="horizontal-modal-input" placeholder="$" />
          </label>
          
          {/* Date Picker Row */}
          <div className="date-picker-row">
            <div className="modal-field">
              <strong>From</strong><br />
              <CalendarPicker 
                selectedDate={fromDate}
                onSelect={setFromDate}
                unavailableDates={item.unavailableDates}
                disableBeforeToday={item.disableBeforeToday}
              />
            </div>
            <div className="modal-field">
              <strong>To</strong><br />
              <CalendarPicker 
                selectedDate={toDate}
                onSelect={setToDate}
                unavailableDates={item.unavailableDates}
                disableBeforeToday={item.disableBeforeToday}
              />
            </div>
          </div>
          
          {/* Request Message Field */}
          <label className="modal-field">
            <strong>Request Message</strong><br />
            <textarea className="horizontal-modal-textarea" placeholder="Write a message..." />
          </label>
          
          <button className="horizontal-modal-button">RSVP</button>
        </div>
      </div>
    </div>
  );
};

export default HorizontalCardModal;