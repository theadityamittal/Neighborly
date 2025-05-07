import React from "react";
import VerticalCard from "../../../components/VerticalCard/VerticalCard";
import { useNavigate } from "react-router";

const PetitionCards = ({ petitions }) => {
    const navigate = useNavigate();

    const viewPetition = (id) => {
      console.log(`Card with ID ${id} clicked`);
      // Navigate to the detailed petition page
      navigate(`/petition/${id}`);
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
            <div key={item.id} style={{ 
              width: 'calc(32%)',
              minWidth: '350px',
              marginBottom: '20px',
            }}>
              <VerticalCard
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
              />
            </div>
          ))
        }
      </div>
    )
}
export default PetitionCards;