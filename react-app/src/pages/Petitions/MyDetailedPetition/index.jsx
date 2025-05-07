import React from "react";
import './styles.css'; // You'll need to create this CSS file
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Assuming you're using Material UI
import axiosInstance from "../../../utils/axiosInstance";
import { useSelector } from "react-redux";
import HorizontalCardModalEdit from "../../../components/HorizontalCard/HorizontalCardModalEdit";

const MyDetailedPetition = () => {
  const { petition_id } = useParams();
  const [petitionDetails, setpetitionDetails] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [selectedEdit, setSelectedEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { access } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleClose = () => {
    setSelectedEdit(false);
  };

  useEffect(() => {
    const fetchpetition = async () => {

      try {
        const response = await axiosInstance.get(`/petitions/grabPetitionData/${petition_id}/`, {
          headers: {
            Authorization: `Bearer ${access}`,
            "Content-Type": "multipart/form-data",
          }
        });
        console.log(response.data)
        setpetitionDetails(response.data.petition);
        setParticipants(response.data.petition_signatures);
      } catch (err) {
        console.error("Error fetching petition details:", err);
        setError("Failed to load petition details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchpetition();
  }, [access, petition_id]);

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (loading || !petitionDetails) {
    return <div className="loading">Loading petition details...</div>;
  }

  return (
    <div className="detailed-petition-container">
      <div className="petition-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowBackIcon /> Back
        </button>
        <div className="petition-tags">
          {petitionDetails.tags && petitionDetails.tags.map((tag, index) => (
            <span key={index} className="petition-tag">{tag}</span>
          ))}
        </div>
      </div>
      <h1 className="petition-title">{petitionDetails.title}</h1>
      <div className="petition-content">
        <div className="petition-main-info">
          <div className="petition-author">
            <span className="meta-label">Created by:</span> {petitionDetails.provider}
          </div>
          <div className="petition-hero">
            <img 
              src={petitionDetails.hero_image} 
              alt={petitionDetails.title} 
              className="petition-hero-image"
            />
          </div>
          <div className="petition-meta">
            <div className="petition-date">
              <span className="meta-label">Ends At:</span> {petitionDetails.voting_ends_at}
            </div>
            <div className="petition-location">
              <span className="meta-label">Location:</span> {petitionDetails.location}
            </div>
          </div>
          <h2 className="description-title">Description</h2>
          {petitionDetails.description}
          <div className="petition-description"></div>
        </div>
        <div className="petition-description-container">
          <div>
            <h2 className="description-title">List of Signatures</h2>
            <p className="petition-description">{
              participants.map((participant) => (
                <div>{participant.user_id}</div>
              ))}</p>
          </div>
          <div className="petition-cta">
            <button className="sign-petition-button" onClick={() => setSelectedEdit(!selectedEdit)}>Edit this petition</button>
          </div>
              {selectedEdit && (
            <HorizontalCardModalEdit
              isOpen={!!selectedEdit}
              onClose={handleClose}
              item={{
                image: petitionDetails.hero_image,
                description: petitionDetails.description,
                title: petitionDetails.title,
                id: petitionDetails.petition_id,
                date: petitionDetails.voting_ends_at,
                visibility: petitionDetails.visibility,
                location: petitionDetails.location,
              }}
              type="petition"
              api="petitions/petitions"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MyDetailedPetition;