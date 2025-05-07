import React from "react";
import VerticalCard from "../../../components/VerticalCard/VerticalCard";
import { useNavigate } from "react-router";

const PetitionCards = ({ petitions, handleCardClick }) => {
    const navigate = useNavigate();

    const viewPetition = (petition_id) => {
      console.log(`Card with ID ${petition_id} clicked`);
      // Navigate to the detailed petition page
      navigate(`/petition/${petition_id}`);
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
            <div key={item.petition_id} style={{ 
              width: 'calc(32%)',
              minWidth: '350px',
              marginBottom: '20px',
            }}>
              <VerticalCard
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
              />
            </div>
          ))
        }
      </div>
    )
}
export default PetitionCards;