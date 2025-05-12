import React, { useState } from 'react';
import HorizontalCard from "../../../components/HorizontalCard/HorizontalCard";
import { formatDate, formatTime } from "../Events";
import HorizontalCardModal from '../../../components/HorizontalCard/HorizontalCardModal';
import axiosInstance from '../../../utils/axiosInstance';
import { useSelector } from 'react-redux';

const EventCards = ({eventCards, handleCardClick}) => {  
    const [selectedEvent, setSelectedEvent] = useState(null);
    const { access } = useSelector((state) => state.auth);

    const handleClose = () => {
        setSelectedEvent(null);
    };

    const handleEventSignup = async (event_id) => {
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
    
    return (
    <>
    <div className="events-list">
        {eventCards.map((event) => (
        <div key={event.event_id} className="events-item">
            <HorizontalCard
                id={event.event_id}
                title={event.event_name}
                provider={event.organizer_name}
                location={
                    <span>
                    {event.location}
                    {event.location_link && (
                        <a
                        href={event.location_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open in Maps"
                        >
                        📍
                        </a>
                    )}
                    </span>
                }
                closestAvailability={`${formatDate(event.date)} at ${formatTime(event.time)}`}
                image={event.image}
                tabs={[...(event.tags || []), event.visibility]}
                viewType="card"
                onView={() => {
                    if (handleCardClick) {
                        handleCardClick(event);
                    } else {
                        setSelectedEvent(event);
                    }
                }}
                isNGO={event.provider_details.account_type === "NGO"}
            />
        </div>
        ))}
    </div>
    {selectedEvent && (
    <HorizontalCardModal
        isOpen={!!selectedEvent}
        toggleOffPrices={true}
        toggleOffDates={true}
        toggleOffRequest={true}
        description={selectedEvent.description}
        onClose={handleClose}
        item={selectedEvent}
        type="events"  // must match your API prefix if used
        api_key=""
        handleCustomAPICall={() => handleEventSignup(selectedEvent.event_id)}
    />
    )}
    </>
    );
};

export default EventCards;