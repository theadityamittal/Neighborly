import React, { useState } from "react";
import HorizontalCard from "../../components/HorizontalCard/HorizontalCard"; // adjust if the path is different
import HorizontalCardModal from "../../components/HorizontalCard/HorizontalCardModal"; // adjust if the path is different
//import "../Services/Services.css";

// Iamges
import drill1 from "../../assets/img/drill1.jpg";
import mower1 from "../../assets/img/mower1.jpg";
import wrench1 from "../../assets/img/wrench1.jpg";
import chainsaw1 from "../../assets/img/chainsaw1.jpg";
import carjack1 from "../../assets/img/carjack1.jpg";


const dummyTools = [
  {
    id: "1",
    title: "Cordless Drill Set",
    provider: "Tool Depot",
    location: "Austin, TX",
    closestAvailability: "April 10, 2025",
    images: [drill1],
    unavailableDates: ["2025-04-10", "2025-04-11"],
    price: "$5 / Day",
    viewType: "card",
    tabs: ["DIY", "Power Tools"]
  },
  {
    id: "2",
    title: "Lawn Mower",
    provider: "Green Yard Rentals",
    location: "Portland, OR",
    closestAvailability: "April 9, 2025",
    images: [mower1],
    unavailableDates: [],
    price: "$10 / Day",
    viewType: "card",
    tabs: ["Gardening", "Outdoor"]
  },
  {
    id: "3",
    title: "Socket Wrench Kit",
    provider: "Mechanic’s Corner",
    location: "Phoenix, AZ",
    closestAvailability: "April 12, 2025",
    images: [wrench1],
    unavailableDates: ["2025-04-12"],
    price: "$4 / Day",
    viewType: "card",
    tabs: ["Automotive", "Hand Tools"]
  },
  {
    id: "4",
    title: "Electric Chainsaw",
    provider: "Lumber Pro Rentals",
    location: "Boise, ID",
    closestAvailability: "April 14, 2025",
    images: [chainsaw1],
    unavailableDates: [],
    price: "$8 / Day",
    viewType: "card",
    tabs: ["Gardening", "Power Tools"]
  },
  {
    id: "5",
    title: "Portable Car Jack",
    provider: "QuickFix Garage",
    location: "Las Vegas, NV",
    closestAvailability: "April 11, 2025",
    images: [carjack1],
    unavailableDates: ["2025-04-11"],
    price: "$3 / Day",
    viewType: "card",
    tabs: ["Automotive", "Emergency"]
  }
];


const Services = () => {
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  
  const handleView = (id) => {
    setSelectedServiceId(id);
  };

  const handleClose = () => {
    setSelectedServiceId(null);
  };

  const selectedService = dummyTools.find(service => service.id === selectedServiceId);

  // Add disableBeforeToday flag to the selected service if it exists
  const selectedServiceWithDisable =
    selectedService ? { ...selectedService, disableBeforeToday: true } : null;

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Tools</h1>
      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(2, 1fr)"
        }}
      >
        {dummyTools.map(service => (
          <HorizontalCard
            key={service.id}
            {...service}
            image={service.images[0]}  // Use first image as thumbnail
            onView={() => handleView(service.id)}
          />
        ))}
      </div>

      {selectedService && (
        <HorizontalCardModal
          isOpen={!!selectedService}
          onClose={handleClose}
          item={selectedServiceWithDisable}
        />
      )}
    </div>
  );
};

export default Services;
