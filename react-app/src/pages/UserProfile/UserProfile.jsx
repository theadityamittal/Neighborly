import React, { useState } from "react";
import { Avatar, Button, Typography } from "@mui/material";
import avatar from "../../assets/avatar.png";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import UserProfileForm from "./UserProfileForm";
import HorizontalCard from "../../components/HorizontalCard/HorizontalCard";
import HorizontalCardModal from "../../components/HorizontalCard/HorizontalCardModal";
import VerticalCard from "../../components/VerticalCard/VerticalCard";
import petitionData from "../Petitions/petitionData.json";
import "./UserProfile.css";

// Images
import yoga1 from "../../assets/img/yoga1.jpg";
import cooking1 from "../../assets/img/cooking1.jpg";
import tree1 from "../../assets/img/tree1.jpg";
import pilates1 from "../../assets/img/pilates1.jpg";
import marketing1 from "../../assets/img/marketing1.jpg";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const [filters, setFilters] = useState({
    myPosts: true,
    listedTools: true,
    requestedServices: true,
    hostedEvents: true,
    signedPetitions: true,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { name, neighborhood } = useSelector((state) => state.auth);

  const handleLogOut = () => {
    dispatch(logout());
    navigate("/login", {
      state: { message: "Logout Successful! Returning to Login page..." },
    });
  };

  const handleCardClick = (cardData) => {
    setSelectedCard(cardData);
    setModalOpen(true);
  };

  const handlePetitionClick = (petition) => {
    console.log("Clicked Petition:", petition.title);
    // You can set up a modal or redirect logic here
  };

  const handleFilterChange = (key) => {
    setFilters((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const formatLabel = (key) =>
    key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

  const cardData = {
    myPosts: [
      {
        id: "1",
        title: "Neighborhood Cleanup",
        provider: "Community Org",
        location: "Bay Ridge, NY",
        closestAvailability: "March 20, 2025",
        image: yoga1,
        tabs: ["Community", "Cleaning"],
      },
    ],
    listedTools: [
      {
        id: "2",
        title: "Hammer for Rent",
        provider: "Tool Shed",
        location: "Brooklyn, NY",
        closestAvailability: "Available Now",
        image: cooking1,
        tabs: ["Tools", "DIY"],
      },
    ],
    requestedServices: [
      {
        id: "3",
        title: "Need Help Gardening",
        provider: "Peter Smith",
        location: "Bay Ridge, NY",
        closestAvailability: "April 2, 2025",
        image: tree1,
        tabs: ["Gardening", "Request"],
      },
    ],
    hostedEvents: [
      {
        id: "4",
        title: "Game Night",
        provider: "Peter Smith",
        location: "Bay Ridge, NY",
        closestAvailability: "April 10, 2025",
        image: pilates1,
        tabs: ["Events", "Games"],
      },
    ],
  };

  return (
    <>
      {isEditing ? (
        <UserProfileForm onCancel={() => setIsEditing(false)} />
      ) : (
        <>
          {/* Header */}
          <div className="bulletin-header">
            <div className="profile">
              <Avatar src={avatar} alt="User Avatar" sx={{ width: 80, height: 80 }} />
              <div>
                <Typography variant="h4" className="username">{name}</Typography>
                <Typography variant="body2" className="location">📍 {neighborhood}</Typography>
              </div>
            </div>

            <div className="profile-actions">
              <div className="left-buttons">
                <Button
                  variant="contained"
                  className="edit-profile-btn"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>

                <Button
                  variant="outlined"
                  className="filter-btn"
                  onClick={() => setShowFilters((prev) => !prev)}
                >
                  {showFilters ? "🙈 My Interests" : "🔍 My Interests"}
                </Button>
              </div>

              <div className="right-button">
                <Button
                  variant="contained"
                  className="logout-btn-blue"
                  onClick={handleLogOut}
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="filters-panel">
              {Object.entries(filters).map(([key, value]) => (
                <label key={key}>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => handleFilterChange(key)}
                  />
                  {formatLabel(key)}
                </label>
              ))}
            </div>
          )}

          {/* Card Grid */}
          <div className="bulletin-cards">
            {Object.keys(filters).map(
              (key) =>
                filters[key] &&
                cardData[key]?.map((card) => (
                  <HorizontalCard
                    key={card.id}
                    title={card.title}
                    provider={card.provider}
                    location={card.location}
                    closestAvailability={card.closestAvailability}
                    image={card.image}
                    tabs={card.tabs}
                    onView={() => handleCardClick(card)}
                  />
                ))
            )}

            {/* Petition Cards (2 max) */}
            {filters.signedPetitions &&
              petitionData.slice(0, 2).map((petition) => (
                <VerticalCard
                  key={petition.id}
                  id={petition.id}
                  title={petition.title}
                  provider={petition.provider}
                  location={petition.location}
                  closestAvailability={petition.closestAvailability}
                  image={petition.image}
                  tabs={petition.tabs}
                  numberSigned={petition.numberSigned}
                  handleClick={() => handlePetitionClick(petition)}
                />
              ))}
          </div>

          {/* Modal */}
          {modalOpen && selectedCard && (
            <HorizontalCardModal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              data={selectedCard}
            />
          )}
        </>
      )}
    </>
  );
};

export default UserProfile;
