import React from "react";
import './styles.css'; // You'll need to create this CSS file
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Assuming you're using Material UI
import axiosInstance from "../../../utils/axiosInstance";
import { useSelector } from "react-redux";
import petitionsJson from "../petitionData.json"; // Import the local JSON file

const DetailedPetition = () => {
  const { id } = useParams();
  const [petitionDetails, setPetitionDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { access } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleSignPetition = async () => {
    const token = localStorage.getItem("access_token");
    try {
      await axiosInstance.post(`/petitions/signPetition/${id}/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Re-fetch petition details to update count
      const response = await axiosInstance.get(`/petitions/grabPetitionData/${id}/`, {
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
    const fetchPetition = async () => {
      // ▶️ LOCAL MOCK (uncomment to use)
      // const pet = petitionsJson.find(pet => String(pet.petition_id) === id);
      // if (pet) {
      //   const processed = {
      //     id: pet.petition_id,
      //     title: pet.title,
      //     provider: pet.provider,
      //     tabs: pet.tags,
      //     numberSigned: 0,
      //     petitionDate: new Date(pet.created_at).toLocaleDateString(),
      //     targetSignatures: pet.target,
      //     location: pet.location,
      //     detailedDescription: pet.description,
      //     image: pet.hero_image,
      //     votingEndsAt: pet.voting_ends_at
      //   };
      //   setPetitionDetails(processed);
      //   setLoading(false);
      //   setError(null);
      //   return;
      // }

      // ▶️ LIVE API FETCH
      try {
        const response = await axiosInstance.get(`/petitions/grabPetitionData/${id}/`, {
          headers: {
            Authorization: `Bearer ${access}`
          }
        });

        const { petition, petition_signatures } = response.data;

        const processed = {
          ...petition,
          id: petition.petition_id,
          title: petition.title,
          provider: petition.provider || petition.organizer_id,
          tabs: petition.tags,
          numberSigned: petition_signatures.length,
          petitionDate: new Date(petition.created_at).toLocaleDateString(),
          targetSignatures: petition.target,
          location: petition.location,
          detailedDescription: petition.description,
          image: petition.hero_image,
          votingEndsAt: petition.voting_ends_at
        };

        setPetitionDetails(processed);
      } catch (err) {
        console.error("Error fetching petition details:", err);
        setError("Failed to load petition details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPetition();
  }, [access, id]);

  if (error) {
    return <div className="error">{error}</div>;
  }

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