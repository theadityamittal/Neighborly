import React, { useState, useEffect } from "react";
import axios from "axios";
import VerticalCard from '../../components/VerticalCard/VerticalCard';
import { useNavigate } from "react-router";
import CreatePetition from "./CreatePetition";
import "./petitions.css";

const Petitions = ({ setPetitionDetails }) => {
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newpetition, setNewPetition] = useState(false);
  const navigate = useNavigate();

  // Define fetchPetitions as a separate function
  const fetchPetitions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      console.log("🪪 Token being used for auth:", token);
      const response = await axios.get("http://localhost:8000/petitions/grabPetitionData/", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = response.data;

      const processed = data.petition.map((petition) => {
        const numberSigned = data.petition_signatures.filter(
          sig => sig.petition_id === petition.petition_id
        ).length;

        return {
          ...petition,
          id: petition.petition_id,
          provider: petition.organizer_id,
          tabs: petition.tags,
          numberSigned,
          image: '/default.jpg', // Optional: set based on tag or ID
        };
      });

      setPetitions(processed);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching petition data:", err);
      setError("Failed to load petitions. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    setNewPetition(false); // reset new petition state
    fetchPetitions(); // initial fetch when component mounts
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
          <CreatePetition 
            setNewPetition={setNewPetition} 
            refreshPetitions={fetchPetitions} // pass down the callback
          />
        ) : (
          <>
            <div className="petition-header">
              <div className="header-text">
                <h2>Petitions</h2>
                <p>Explore and support petitions that matter to you.</p>
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
                ))
              }
            </div>
          </>
        )
      }
    </div>
  );
};

export default Petitions;