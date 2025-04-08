import React, { useState } from "react";
import HorizontalCard from "../../components/HorizontalCard/HorizontalCard"; // adjust if the path is different
import HorizontalCardModal from "../../components/HorizontalCard/HorizontalCardModal"; // adjust if the path is different
import "./Services.css";

// Iamges
import yoga1 from "../../assets/img/yoga1.jpg";
import yoga2 from "../../assets/img/yoga2.jpg";
import cooking1 from "../../assets/img/cooking1.jpg";
import cooking2 from "../../assets/img/cooking2.jpg";
import photo1 from "../../assets/img/photo1.jpg";
import marketing1 from "../../assets/img/marketing1.jpg";
import tree1 from "../../assets/img/tree1.jpg";
import pilates1 from "../../assets/img/pilates1.jpg";


const dummyServices = [
  {
    id: "1",
    title: "Premium Yoga Class",
    provider: "Zen Studio",
    location: "Los Angeles, CA",
    closestAvailability: "March 20, 2025",
    images: [
      yoga1,
      yoga2
    ],
    unavailableDates: ["2025-03-20", "2025-03-21"],
    price: "$7 / Day",
    viewType: "card",
    tabs: ["Yoga", "Fitness"]
  },
  {
    id: "2",
    title: "Gourmet Cooking Workshop",
    provider: "MasterChef Academy",
    location: "New York, NY",
    closestAvailability: "April 5, 2025",
    images: [
      cooking1,
      cooking2,
    ],
    unavailableDates: ["2025-04-05", "2025-04-06"],
    price: "$15 / Day",
    viewType: "card",
    tabs: ["Cooking", "Food"]
  },
  {
    id: "3",
    title: "Photography Bootcamp",
    provider: "Creative Lens Studio",
    location: "Chicago, IL",
    closestAvailability: "April 12, 2025",
    images: [photo1],
    unavailableDates: [],
    price: "$20 / Day",
    viewType: "card",
    tabs: ["Photography", "Art"]
  },
  {
    id: "4",
    title: "Digital Marketing Course",
    provider: "Online Academy",
    location: "San Francisco, CA",
    closestAvailability: "March 25, 2025",
    images: [marketing1],
    unavailableDates: ["2025-03-25"],
    price: "$10 / Day",
    viewType: "card",
    tabs: ["Marketing", "Business"]
  },
  {
    id: "5",
    title: "Pilates Training Session",
    provider: "Wellness Hub",
    location: "Seattle, WA",
    closestAvailability: "April 8, 2025",
    images: [pilates1],
    unavailableDates: [],
    price: "$12 / Day",
    viewType: "card",
    tabs: ["Pilates", "Fitness"]
  },
  {
    id: "6",
    title: "Tree Climbing Workshop",
    provider: "Adventure Club",
    location: "Denver, CO",
    closestAvailability: "April 15, 2025",
    images: [tree1],
    unavailableDates: ["2025-04-15"],
    price: "$18 / Day",
    viewType: "card",
    tabs: ["Adventure", "Fitness"]
  },
];


const Services = () => {
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  
  const handleView = (id) => {
    setSelectedServiceId(id);
  };

  const handleClose = () => {
    setSelectedServiceId(null);
  };

  const selectedService = dummyServices.find(service => service.id === selectedServiceId);

  // Add disableBeforeToday flag to the selected service if it exists
  const selectedServiceWithDisable =
    selectedService ? { ...selectedService, disableBeforeToday: true } : null;

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Services</h1>
      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(2, 1fr)"
        }}
      >
        {dummyServices.map(service => (
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

// const Services = () => {
//   const [selectedServiceId, setSelectedServiceId] = useState(null);
//   const [createModalOpen, setCreateModalOpen] = useState(false);

//   const handleView = (id) => {
//     setSelectedServiceId(id);
//   };

//   const handleClose = () => {
//     setSelectedServiceId(null);
//   };

//   const selectedService = dummyServices.find(
//     (service) => service.id === selectedServiceId
//   );

//   // Add disableBeforeToday flag to the selected service if it exists
//   const selectedServiceWithDisable =
//     selectedService ? { ...selectedService, disableBeforeToday: true } : null;

//   return (
//     <div className="services-container">
//       <header className="services-header">
//         <h1>Services</h1>
//         <button
//           className="create-service-btn"
//           onClick={() => setCreateModalOpen(true)}
//         >
//           Create Service
//         </button>
//       </header>
//       <div className="services-grid">
//         {dummyServices.map((service) => (
//           <HorizontalCard
//             key={service.id}
//             {...service}
//             image={service.images[0]} // Use first image as thumbnail
//             onView={() => handleView(service.id)}
//           />
//         ))}
//       </div>

//       {selectedService && (
//         <HorizontalCardModal
//           isOpen={!!selectedService}
//           onClose={handleClose}
//           item={selectedServiceWithDisable}
//         />
//       )}

//       {createModalOpen && (
//         <div
//           className="fullpage-modal-overlay"
//           onClick={() => setCreateModalOpen(false)}
//         >
//           <div className="fullpage-modal-content" onClick={(e) => e.stopPropagation()}>
//             <button
//               className="fullpage-modal-close"
//               onClick={() => setCreateModalOpen(false)}
//             >
//               ×
//             </button>
//             <CreateServices onClose={() => setCreateModalOpen(false)} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };


export default Services;
