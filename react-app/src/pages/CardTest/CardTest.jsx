// import React, { useState } from "react";
// import HorizontalCard from "../../components/HorizontalCard/HorizontalCard";
// import './CardTest.css';

// function CardTest() {
//   const [selectedCardId, setSelectedCardId] = useState(null);

//   const fakeData = [
//         {
//           id: "1",
//           title: "Premium Yoga Class",
//           provider: "Zen Studio",
//           location: "Los Angeles, CA",
//           closestAvailability: "March 20, 2025",
//           image: "https://placehold.co/100x100",
//           viewType: "card",
//           tabs: ["Yoga", "Fitness"],
//         },
//         {
//           id: "2",
//           title: "Gourmet Cooking Workshop",
//           provider: "MasterChef Academy",
//           location: "New York, NY",
//           closestAvailability: "April 5, 2025",
//           image: "https://placehold.co/100x100",
//           viewType: "card",
//           tabs: ["Cooking", "Food"],
//         },
//         {
//           id: "3",
//           title: "Photography Bootcamp",
//           provider: "Creative Lens Studio",
//           location: "Chicago, IL",
//           closestAvailability: "April 12, 2025",
//           image: "https://placehold.co/100x100",
//           viewType: "card",
//           tabs: ["Photography", "Art"],
//         },
//         {
//           id: "4",
//           title: "Digital Marketing Course",
//           provider: "Online Academy",
//           location: "San Francisco, CA",
//           closestAvailability: "March 25, 2025",
//           image: "https://placehold.co/100x100",
//           viewType: "card",
//           tabs: ["Marketing", "Business"],
//         },
//         {
//           id: "5",
//           title: "Pilates Training Session",
//           provider: "Wellness Hub",
//           location: "Seattle, WA",
//           closestAvailability: "April 8, 2025",
//           image: "https://placehold.co/100x100",
//           viewType: "card",
//           tabs: ["Pilates", "Fitness"],
//         },
//         {
//             id: "6",
//             title: "Tree Climbing Workshop",
//             provider: "Adventure Club",
//             location: "Denver, CO",
//             closestAvailability: "April 15, 2025",
//             image: "https://placehold.co/100x100",
//             viewType: "card",
//             tabs: ["Adventure", "Fitness"],
//           },
//       ];
  
//       const selectedHorizontalCard = fakeData.find(item => item.id === selectedCardId);

//   const handleClose = () => setSelectedCardId(null);

//   return (
//     <div className="test-container">
//       <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
//         {fakeData.map((item) => (
//           <HorizontalCard
//             key={item.id}
//             {...item}
//             onView={() => setSelectedCardId(item.id)}
//           />
//         ))}
//       </div>

//       {/* Modal Popup showing the same HorizontalCard data */}
//       {selectedHorizontalCard && (
//         <div className="modal-overlay" onClick={handleClose}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <button className="modal-close" onClick={handleClose}>×</button>
//             <HorizontalCard {...selectedHorizontalCard} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default CardTest;

import React, { useState } from "react";
import HorizontalCard from "../../components/HorizontalCard/HorizontalCard";
import HorizontalCardModal from "../../components/HorizontalCard/HorizontalCardModal";

// Fake API data, with dates as strings and added price field
const fakeData = [
  {
    id: "1",
    title: "Premium Yoga Class",
    provider: "Zen Studio",
    location: "Los Angeles, CA",
    closestAvailability: "March 20, 2025",
    images: [
      "https://placehold.co/100x100?text=Img1",
      "https://placehold.co/100x100?text=Img2",
      "https://placehold.co/100x100?text=Img3"
    ],
    unavailableDates: ["2025-03-20", "2025-03-21"],
    price: "$7 / Day",
    viewType: "card",
    tabs: ["Yoga", "Fitness"],
  },
  {
    id: "2",
    title: "Gourmet Cooking Workshop",
    provider: "MasterChef Academy",
    location: "New York, NY",
    closestAvailability: "April 5, 2025",
    images: [
      "https://placehold.co/100x100?text=Img1",
      "https://placehold.co/100x100?text=Img2"
    ],
    unavailableDates: ["2025-04-04"],
    price: "$15 / Day",
    viewType: "card",
    tabs: ["Cooking", "Food"],
  },
  {
    id: "3",
    title: "Photography Bootcamp",
    provider: "Creative Lens Studio",
    location: "Chicago, IL",
    closestAvailability: "April 12, 2025",
    images: ["https://placehold.co/100x100?text=Img1"],
    unavailableDates: [],
    price: "$20 / Day",
    viewType: "card",
    tabs: ["Photography", "Art"],
  },
  {
    id: "4",
    title: "Digital Marketing Course",
    provider: "Online Academy",
    location: "San Francisco, CA",
    closestAvailability: "March 25, 2025",
    images: ["https://placehold.co/100x100?text=Img1"],
    unavailableDates: ["2025-03-25"],
    price: "$10 / Day",
    viewType: "card",
    tabs: ["Marketing", "Business"],
  },
  {
    id: "5",
    title: "Pilates Training Session",
    provider: "Wellness Hub",
    location: "Seattle, WA",
    closestAvailability: "April 8, 2025",
    images: ["https://placehold.co/100x100?text=Img1"],
    unavailableDates: [],
    price: "$12 / Day",
    viewType: "card",
    tabs: ["Pilates", "Fitness"],
  },
  {
    id: "6",
    title: "Tree Climbing Workshop",
    provider: "Adventure Club",
    location: "Denver, CO",
    closestAvailability: "April 15, 2025",
    images: ["https://placehold.co/100x100?text=Img1"],
    unavailableDates: ["2025-04-15"],
    price: "$18 / Day",
    viewType: "card",
    tabs: ["Adventure", "Fitness"],
  },
];

// Process the fakeData to convert unavailableDates strings to Date objects
const processedData = fakeData.map(item => ({
  ...item,
  unavailableDates: item.unavailableDates.map(dateStr => new Date(dateStr))
}));

const CardTest = () => {
  const [selectedCardId, setSelectedCardId] = useState(null);
  const selectedCard = processedData.find((item) => item.id === selectedCardId);

  // Add disableBeforeToday flag to the selected card if it exists
  const selectedCardWithDisable =
    selectedCard ? { ...selectedCard, disableBeforeToday: true } : null;

  return (
    <div className="test-container">
      <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
        {processedData.map((item) => (
          <HorizontalCard
            key={item.id}
            {...item}
            image={item.images[0]} // Use the first image as the card thumbnail
            onView={() => setSelectedCardId(item.id)}
          />
        ))}
      </div>

      <HorizontalCardModal
        isOpen={!!selectedCard}
        onClose={() => setSelectedCardId(null)}
        item={selectedCardWithDisable}
      />
    </div>
  );
};

export default CardTest;