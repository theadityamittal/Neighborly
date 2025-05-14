import React, { useState, useEffect } from "react";
import "./HorizontalCardModal.css";
import axiosInstance from "../../utils/axiosInstance"; 
import CalendarPicker from "../CalendarPicker/CalendarPicker";
import FormLocationPicker from "../LocationPicker/FormLocationPicker";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';


const HorizontalCardModalEdit = ({ isOpen, onClose, item, item_name, type, api}) => {
    const [date, setDate] = useState(item.date);
    const [time, setTime] = useState(item.time);
    const [title, setTitle] = useState(item.title);
    const [visibility, setVisibility] = useState(item.visibility);
    const [location, setLocation] = useState(item.location)
    const [description, setDescription] = useState(item.description);
    const [locationInfo, setLocationInfo] = useState({
        address: '',
        city: '',
        neighborhood: '',
        zipCode: '',
        latitude: null,
        longitude: null,
    });
    if (!isOpen || !item) return null;

    const handleSubmit = async () => {
        const token = localStorage.getItem("access_token");
        try {
            const formData = new FormData();

            if (type === 'Event') {
              formData.append("event_name", title);
              formData.append("location", location);
              formData.append("description", description);
              formData.append("time", time);
              formData.append("visibility", visibility);
            }
        
            else if (type === 'Service') {
                formData.append("title", title);
                formData.append("location", location);
                formData.append("description", description);
                formData.append("visibility", visibility);
                formData.append("street_address", locationInfo["address"]);
                formData.append("city", locationInfo["city"]);
                formData.append("neighborhood", locationInfo["neighborhood"]);
                formData.append("zip_code", locationInfo["zipCode"]);
                formData.append("latitude", locationInfo["latitude"]);
                formData.append("longitude", locationInfo["longitude"]);
            }
            
            else if (type === 'Tool') {
                formData.append("title", title);
                formData.append("location", location);
                formData.append("description", description);
                formData.append("visibility", visibility);
                formData.append("address", locationInfo["address"]);
                formData.append("city", locationInfo["city"]);
                formData.append("neighborhood", locationInfo["neighborhood"]);
                formData.append("zip_code", locationInfo["zipCode"]);
                formData.append("latitude", locationInfo["latitude"]);
                formData.append("longitude", locationInfo["longitude"]);
            }

            else if (type === 'Petition') {
                formData.append("title", title);
                formData.append("description", description);
                formData.append("visibility", visibility);
                formData.append("location", location);
                formData.append("street_address", locationInfo["address"]);
                formData.append("city", locationInfo["city"]);
                formData.append("neighborhood", locationInfo["neighborhood"]);
                formData.append("zip_code", locationInfo["zipCode"]);
                formData.append("latitude", locationInfo["latitude"]);
                formData.append("longitude", locationInfo["longitude"]);
                formData.append("voting_ends_at", date);
            }

          await axiosInstance.patch(`/${api}/${item.id}/`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            }
          });
          alert("Successfully updated event!");
          onClose();
        } catch (err) {
          console.error("Error Updating Event:", err);
          alert("Failed to update event.");
        }
      };

    return (
    <div className="horizontal-modal-overlay" onClick={onClose}>
        <div className="horizontal-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="horizontal-modal-close" onClick={onClose}>×</button>
                    
        {/* Gallery Section */}
        <div className="modal-gallery">
            <img
                src={item.image}
                alt={"something"}
            />
        </div>
        <h2 className="modal-title">
            <strong>Title</strong><br />
            <textarea
              className="horizontal-modal-input"
              placeholder="Write the title here ..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
        </h2>
        <FormControl>
            <label className="input-label">Visibility</label>
            <RadioGroup
            row
            aria-labelledby="visibility-group-label"
            name="visibility"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            >
            <FormControlLabel value="public" control={<Radio />} label="Public" />
            <FormControlLabel value="neighborhood" control={<Radio />} label="Neighborhood Only" />
            <FormControlLabel value="invitation" control={<Radio />} label="Invitation Only" />
            </RadioGroup>
        </FormControl>

        
        {/* Details Section */}
        <div className="modal-details">
            {/* Combined Information Line */}
            <div className="modal-info-line"/>

            {/* Description */}
            <label className="modal-field">
            <strong className="modal-title">Description</strong><br />
            <textarea
                className="horizontal-modal-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            </label>
            
            {/* Date Picker Row */}
            { type !== 'Tool' && type !== 'Service' && type !== 'Petition' ?
            <div className="date-picker-row">
            <div className="date-picker-column">
                <strong>Date</strong>
                <CalendarPicker 
                selectedDate={date}
                onSelect={setDate}
                unavailableDates={item.unavailableDates}
                disableBeforeToday={item.disableBeforeToday}
                />
            </div>
            </div>            
            : <></>}
            { type !== 'Service' && type !== 'Petition' && type !== 'Tool' ?
                <>
                    <label className="input-label">Time</label>
                    <input
                    className="input"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    />
                </>
            : <></> }

            <div className="form-group">
            <label htmlFor="address">Street Address</label>
            { type === 'Event' ?
                <></>
            :
                <FormLocationPicker
                location={location}
                setLocation={(val) => setLocation(val)}
                onCoordinatesChange={(loc) => {
                    setLocationInfo((prev) => ({
                        ...prev,
                        latitude: parseFloat(loc.latitude.toFixed(6)),
                        longitude: parseFloat(loc.longitude.toFixed(6)),
                        address: loc.locationName,
                        neighborhood: loc.neighborhood,
                        zipCode: loc.zipCode,
                        city: loc.city,
                    }));
                }}
                latitude={item.latitude}
                longitude={item.longitude}
                />
            }
            </div>

            <button onClick={handleSubmit} className="horizontal-modal-button">
            Edit {type}
            </button>
        </div>
        </div>
    </div>
    );
};

export default HorizontalCardModalEdit;