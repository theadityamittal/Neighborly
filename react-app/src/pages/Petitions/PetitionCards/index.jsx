import React from "react";
import VerticalCard from "../../../components/VerticalCard/VerticalCard";
import { useNavigate } from "react-router";

<<<<<<< HEAD
const PetitionCards = ({ petitions }) => {
    const navigate = useNavigate();

    const viewPetition = (id) => {
      console.log(`Card with ID ${id} clicked`);
      // Navigate to the detailed petition page
      navigate(`/petition/${id}`);
=======
const PetitionCards = ({ petitions, handleCardClick }) => {
    const navigate = useNavigate();

    const viewPetition = (petition_id) => {
      console.log(`Card with ID ${petition_id} clicked`);
      // Navigate to the detailed petition page
      navigate(`/petition/${petition_id}`);
>>>>>>> 2853bf3805e39ed850dac0c989affcba4e0192cf
    };

    return (
        <div className="petition-cards">
        {petitions.length === 0 ?
          <div style={{
            width: '100%',
            textAlign: 'center',
            fontSize: '18px',
            color: '#555',
          }}>
            No petitions available.
          </div>
        :
          petitions.map((item) => (
<<<<<<< HEAD
            <div key={item.id} style={{ 
=======
            <div key={item.petition_id} style={{ 
>>>>>>> 2853bf3805e39ed850dac0c989affcba4e0192cf
              width: 'calc(32%)',
              minWidth: '350px',
              marginBottom: '20px',
            }}>
              <VerticalCard
<<<<<<< HEAD
                id={item.id}
                title={item.title}
                provider={item.provider}
                location={item.location}
                closestAvailability={item.closestAvailability}
                image={item.image}
                viewType={item.viewType}
                tags={item.tags}
                numberSigned={item.numberSigned}
                handleClick={() => viewPetition(item.id)}
=======
                id={item.petition_id}
                title={item.title}
                description={item.description}
                provider={item.provider}
                location={item.location}
                image={item.hero_image}
                tags={item.tags}
                numberSigned={item.signature_count}
                handleClick={() => {
                  if (handleCardClick) {
                    handleCardClick(item);
                  } else {
                    viewPetition(item.petition_id);
                  }
                }}
                isNGO={item.provider_details.account_type === "NGO"}
>>>>>>> 2853bf3805e39ed850dac0c989affcba4e0192cf
              />
            </div>
          ))
        }
      </div>
    )
}
export default PetitionCards;