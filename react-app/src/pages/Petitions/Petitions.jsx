import React from "react";
import VerticalCard from '../../components/VerticalCard/VerticalCard'

const Petitions = () => {

  const fakePetitionData = [
    {
      id: "1",
      title: "Protect Local Green Spaces",
      provider: "Eco Warriors",
      location: "Portland, OR",
      closestAvailability: "April 5, 2025",
      image: "https://placehold.co/100x100",
      viewType: "card",
      tabs: ["Environment", "Community"],
      numberSigned: 2_500,
    },
    {
      id: "2",
      title: "Increase Teacher Salaries",
      provider: "Educators United",
      location: "Chicago, IL",
      closestAvailability: "March 28, 2025",
      image: "https://placehold.co/100x100",
      viewType: "card",
      tabs: ["Education", "Policy"],
      numberSigned: 4_100,
    },
    {
      id: "3",
      title: "Ban Single-Use Plastics",
      provider: "Ocean Protection League",
      location: "San Francisco, CA",
      closestAvailability: "April 10, 2025",
      image: "https://placehold.co/100x100",
      viewType: "card",
      tabs: ["Environment", "Legislation"],
      numberSigned: 7_800,
    },
    {
      id: "4",
      title: "Lower Prescription Drug Prices",
      provider: "Healthcare for All",
      location: "New York, NY",
      closestAvailability: "March 22, 2025",
      image: "https://placehold.co/100x100",
      viewType: "card",
      tabs: ["Healthcare", "Policy"],
      numberSigned: 5_600,
    },
    {
      id: "5",
      title: "Stop Animal Testing for Cosmetics",
      provider: "Ethical Beauty Advocates",
      location: "Los Angeles, CA",
      closestAvailability: "April 15, 2025",
      image: "https://placehold.co/100x100",
      viewType: "card",
      tabs: ["Animal Rights", "Ethics"],
      numberSigned: 3_900,
    },
    {
      id: "6",
      title: "Expand Public Transportation",
      provider: "Transit for All",
      location: "Austin, TX",
      closestAvailability: "March 30, 2025",
      image: "https://placehold.co/100x100",
      viewType: "card",
      tabs: ["Infrastructure", "Sustainability"],
      numberSigned: 6_200,
    },
  ];  

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
      gap: '0px'
    }}>
      {
        fakePetitionData.map((item) => (
          <div key={item.id} style={{ 
            width: 'calc(25%)',
            minWidth: '350px',
            marginBottom: '20px'
          }}>
            <VerticalCard
              id={item.id}
              title={item.title}
              provider={item.provider}
              location={item.location}
              closestAvailability={item.closestAvailability}
              image={item.image}
              viewType={item.viewType}
              tabs={item.tabs}
              numberSigned={item.numberSigned}
            />
          </div>
        ))
      }
    </div>
  );
};
export default Petitions;