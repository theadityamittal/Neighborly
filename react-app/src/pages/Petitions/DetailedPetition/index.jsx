import React from "react";
import './styles.css'; // You'll need to create this CSS file
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Assuming you're using Material UI

const DetailedPetition = ({petitionDetails}) => {
  // Check if petitionDetails exists to avoid errors
  if (!petitionDetails) {
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
            <button className="sign-petition-button">Sign this petition</button>
            <button className="share-petition-button">Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedPetition;