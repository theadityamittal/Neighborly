import React from "react";
import './styles.css'; // You'll need to create this CSS file
import { useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Assuming you're using Material UI

const DetailedPetition = () => {
  const { id } = useParams();
  const [petitionDetails, setPetitionDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleSignPetition = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(`http://localhost:8000/petitions/signPetition/${id}/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Re-fetch petition details to update count
      const response = await axios.get(`http://localhost:8000/petitions/grabPetitionData/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const { petition, petition_signatures } = response.data;

      setPetitionDetails(prev => ({
        ...prev,
        numberSigned: petition_signatures.length
      }));
    } catch (err) {
      console.error("Error signing petition:", err);
      alert("Failed to sign petition.");
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Petition link copied to clipboard!");
    } catch (err) {
      console.error("Clipboard error:", err);
      alert("Could not copy link.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchPetition = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/petitions/grabPetitionData/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const { petition, petition_signatures } = response.data;

        const processed = {
          ...petition,
          id: petition.petition_id,
          provider: petition.organizer_id,
          tabs: petition.tags,
          numberSigned: petition_signatures.length,
          petitionDate: new Date(petition.created_at).toLocaleDateString(),
          targetSignatures: petition.target,
          location: "Community Center", // Optional placeholder
          detailedDescription: petition.description,
          image: "/default.jpg"
        };

        setPetitionDetails(processed);
      } catch (err) {
        console.error("Error fetching petition details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPetition();
  }, [id]);

  if (loading || !petitionDetails) {
    return <div className="loading">Loading petition details...</div>;
  }

  return (
    <div className="detailed-petition-container">
      <div className="petition-header">
        <button className="back-button" onClick={() => window.history.back()}>
          <ArrowBackIcon /> Back
        </button>
        <div className="petition-tags">
          {petitionDetails.tabs && petitionDetails.tabs.map((tag, index) => (
            <span key={index} className="petition-tag">{tag}</span>
          ))}
        </div>
      </div>
      <h1 className="petition-title">{petitionDetails.title}</h1>
      <div className="petition-content">
        <div className="petition-main-info">
          <div className="petition-author">
            <span className="meta-label">Created by:</span> {petitionDetails.provider || petitionDetails.petitionAuthor}
          </div>
          <div className="petition-hero">
            <img 
              src={petitionDetails.heroImage || petitionDetails.image} 
              alt={petitionDetails.title} 
              className="petition-hero-image"
            />
          </div>
          <div className="petition-meta">
            <div className="petition-date">
              <span className="meta-label">Date:</span> {petitionDetails.petitionDate}
            </div>
            <div className="petition-location">
              <span className="meta-label">Location:</span> {petitionDetails.location}
            </div>
          </div>
          <div className="petition-progress">
            <div className="progress-stats">
              <div className="signatures">
                <span className="signature-count">{petitionDetails.numberSigned}</span>
                <span className="signature-label">people signed</span>
              </div>
              <div className="target">
                <span className="target-count">Target: {petitionDetails.targetSignatures}</span>
              </div>
            </div>

            <div className="progress-bar-container">
              <div 
                className="progress-bar" 
                style={{ width: `${Math.min((petitionDetails.numberSigned / petitionDetails.targetSignatures) * 100, 100)}%` }}
              ></div>
            </div>

            {petitionDetails.votingEndsAt && (
              <div className="voting-deadline">
                Voting ends on: {new Date(petitionDetails.votingEndsAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
        <div className="petition-description-container">
          <div>
            <h2 className="description-title">Description</h2>
            <p className="petition-description">{petitionDetails.detailedDescription}</p>
          </div>
          <div className="petition-cta">
            <button className="sign-petition-button" onClick={handleSignPetition}>Sign this petition</button>
            <button className="share-petition-button" onClick={handleShare}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedPetition;