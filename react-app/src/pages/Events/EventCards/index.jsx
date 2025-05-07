import React from 'react';
import HorizontalCard from "../../../components/HorizontalCard/HorizontalCard";
import { formatDate, formatTime } from "../Events";


const EventCards = ({eventCards, handleCardClick}) => {    
    return (
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
                    onView={() => handleCardClick(event)}
                />
            </div>
            ))}
        </div>
    );
};

export default EventCards;