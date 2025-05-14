import React, { useState } from 'react';
import HorizontalCard from '../../../components/HorizontalCard/HorizontalCard';
import HorizontalCardModal from '../../../components/HorizontalCard/HorizontalCardModal';

const ServiceCards = ({services, handleCardClick}) => {
    const [selectedService, setSelectedService] = useState(null);
    
    const handleClose = () => {
        setSelectedService(null);
    };

    const selectedServiceWithDisable = selectedService
    ? { ...selectedService, disableBeforeToday: true }
    : null;

    return (
    <>
      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(2, 1fr)"
        }}
      >
        {services.map(service => (
          <HorizontalCard
            key={service.service_id}
            id={service.service_id}
            title={service.title}
            provider={service.provider_details.name}
            description={service.description}
            location={service.neighborhood}
            price={service.price}
            available={service.available}
            closestAvailability={service.closestAvailability}
            tags={service.tags}
            image={service.images}
            onView={() => {
                if (handleCardClick) {
                    handleCardClick(service);
                } else {
                    const formatted = selectedService
                    ? { ...selectedService, disableBeforeToday: true }
                    : null;
                    setSelectedService(service);
                }
            }}
            isNGO={service.provider_details.account_type === "NGO"}
          />
        ))}
      </div>

      {selectedService && (
        <HorizontalCardModal
          isOpen={!!selectedService}
          onClose={handleClose}
          item={selectedServiceWithDisable}
          type="service" // must match the API prefix without 's'
          api_key = "signup"
        />
      )}
    </>
    );
};

export default ServiceCards;