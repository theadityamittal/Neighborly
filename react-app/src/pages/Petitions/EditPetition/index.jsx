import React from "react";
import './styles.css';
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axiosInstance from "../../../utils/axiosInstance";
import { useSelector } from "react-redux";
import HorizontalCardModalEdit from "../../../components/HorizontalCard/HorizontalCardModalEdit";

const EditPetition = () => {
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

  const fetchPetition = async () => {
    try {
      const response = await axiosInstance.get(`/petitions/grabPetitionData/${petition_id}/`, {
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-Type": undefined,
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

  useEffect(() => {
    fetchPetition();
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
      </div>
      
      {/* Petition Details Section */}
      <div className="petition-section">
        <h1 className="petition-title">{petitionDetails.title}</h1>
        
        <div className="petition-content">
          <div className="petition-image-side">
            {petitionDetails.hero_image ? (
              <img 
                src={petitionDetails.hero_image} 
                alt={petitionDetails.title} 
                className="petition-hero-image"
              />
            ) : (
              <div className="no-image">No image available</div>
            )}
            
            {/* Moved edit button under the image */}
            <button className="edit-button" onClick={() => setSelectedEdit(!selectedEdit)}>
              Edit this Petition
            </button>
          </div>
          
          <div className="petition-details-side">
            <div className="petition-meta">
              <div className="meta-item">
                <span className="meta-label">CREATED BY</span>
                <span className="meta-value">{petitionDetails.provider}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">ENDS AT</span>
                <span className="meta-value">{new Date(petitionDetails.voting_ends_at).toLocaleDateString()}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">LOCATION</span>
                <span className="meta-value">{petitionDetails.location}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">VISIBILITY</span>
                <span className="meta-value">{petitionDetails.visibility}</span>
              </div>
            </div>
            
            <div className="description-section">
              <h3 className="description-title">DESCRIPTION</h3>
              <div className="petition-description-text">{petitionDetails.description || 'No description provided'}</div>
            </div>
            
            {petitionDetails.tags && petitionDetails.tags.length > 0 && (
              <div className="tags-section">
                <h3 className="tags-title">TAGS</h3>
                <div className="petition-tags-list">
                  {petitionDetails.tags.map((tag, index) => (
                    <span key={index} className="petition-tag-item">{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Signatures Section */}
      <div className="signatures-section">
        <h2 className="signatures-title">Petition Signatures</h2>
        
        {participants.length === 0 ? (
          <div className="no-signatures">No signatures yet</div>
        ) : (
          <div className="signatures-list">
            {participants.filter((participant) => participant.user_name).map((participant, index) => (
              <div key={index} className="signature-item">
                {participant.user_icon ? (
                  <img 
                    src={participant.user_icon} 
                    alt={participant.user_name}
                    className="signature-icon"
                  />
                ) : (
                  <div className="signature-icon" style={{ backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {participant.user_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="signature-details">
                  <div className="signature-name">{participant.user_name}</div>
                  {participant.signed_at && (
                    <div className="signature-date">
                      Signed on {new Date(participant.signed_at).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
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
            latitude: petitionDetails.latitude,
            longitude: petitionDetails.longitude,
          }}
          type="Petition"
          api="petitions/edit_petitions"
        />
      )}
    </div>
  );
};

export default EditPetition;