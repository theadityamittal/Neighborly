import React, { useState, useEffect } from "react";
import VerticalCard from '../../components/VerticalCard/VerticalCard';
import petitionData from './petitionData.json';
import { useNavigate } from "react-router";

const Petitions = ({setPetitionDetails}) => {
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPetitions = async () => {
      setLoading(true);
      try {
        // In a real app, this would be your API endpoint
        // const response = await fetch('https://api.example.com/petitions');
        // const data = await response.json();
        
        // For development, use the local JSON file
        setPetitions(petitionData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching petition data:", err);
        setError("Failed to load petitions. Please try again later.");
        setLoading(false);
      }
    };

    fetchPetitions();
  }, []);

  const handleCardClick = (id) => {
    console.log(`Card with ID ${id} clicked`);
    // First set the petition details
    const selectedPetition = petitionData.find(item => item.id === id);
    setPetitionDetails(selectedPetition);
    // Then navigate
    navigate(`/petition/${id}`);
  };

  if (loading) return <div>Loading petitions...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: '20px',
      padding: '20px'
    }}>
      {
        petitions.map((item) => (
          <div key={item.id} style={{ 
            width: 'calc(25% - 20px)',
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
              handleClick={() => handleCardClick(item.id)}
            />
          </div>
        ))
      }
    </div>
  );
};

export default Petitions;