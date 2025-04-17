import React, { useState, useEffect } from "react";
import axios from "axios";
import VerticalCard from '../../components/VerticalCard/VerticalCard';
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import axiosInstance from "../../utils/axiosInstance"; 
import "./petitions.css";

const Petitions = () => {
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { access } = useSelector((state) => state.auth);
  // Define fetchPetitions as a separate function
  const fetchPetitions = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/petitions/grabPetitionData/", {
        headers: {
          Authorization: `Bearer ${access}`
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
          image: petition.hero_image, // Optional: set based on tag or ID
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

  const handleCardClick = (id) => {
    console.log(`Card with ID ${id} clicked`);
    // Navigate to the detailed petition page
    navigate(`/petition/${id}`);
  };

  useEffect(() => {
    fetchPetitions(); // Fetch petitions when the component mounts
    const interval = setInterval(() => {
      fetchPetitions(); // Fetch petitions every 5 minutes
    }, 300000); // 300000 ms = 5 minutes
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  if (loading) return <div>Loading petitions...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: '10px',
    }}>
      <div className="petition-header">
        <div className="header-text">
          <h2>Petitions</h2>
          <p>Explore and support petitions that matter to you.</p>
        </div>
        <div className="petition-header-btn" onClick={() => navigate("/create-petition")}>
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
    </div>
  );
};

export default Petitions;