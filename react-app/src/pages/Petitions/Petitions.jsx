import React, { useState, useEffect } from "react";
import VerticalCard from '../../components/VerticalCard/VerticalCard';
import petitionData from './petitionData.json';
import { useNavigate } from "react-router";
import CreatePetition from "./CreatePetition";
import "./petitions.css"

const Petitions = ({setPetitionDetails}) => {
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newpetition, setNewPetition] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setNewPetition(false);
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
    const selectedPetition = petitions.find(item => item.id === id);
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
      gap: '10px',
    }}>
      {
        newpetition ? (
          <CreatePetition setNewPetition={setNewPetition}/>
        ) :
        (
          <>
            <div className="petition-header">
              <div className="header-text">
                <h2>
                  Petitions
                </h2>
                <p>
                  Explore and support petitions that matter to you.
                </p>
              </div>
              <div className="petition-header-btn" onClick={() => setNewPetition(true)}>
                + Create Petition
              </div>
            </div>
            <hr className="petition-divider"/>
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
              ))}
            </div>
          </>
        )
      }
    </div>
  );
};

export default Petitions;