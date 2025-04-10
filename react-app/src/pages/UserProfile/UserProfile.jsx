import React, { useState } from "react";
import { Avatar, Button, Typography } from "@mui/material";
import "./UserProfile.css";
import avatar from "../../assets/avatar.png";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import { useNavigate } from "react-router";
import UserProfileForm from "./UserProfileForm";
import HorizontalCard from "../../components/HorizontalCard/HorizontalCard";
import HorizontalCardModal from "../../components/HorizontalCard/HorizontalCardModal";

// Image imports
import yoga1 from "../../assets/img/yoga1.jpg";
import cooking1 from "../../assets/img/cooking1.jpg";
import tree1 from "../../assets/img/tree1.jpg";
import pilates1 from "../../assets/img/pilates1.jpg";
import marketing1 from "../../assets/img/marketing1.jpg";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    myPosts: true,
    listedTools: true,
    requestedServices: true,
    hostedEvents: true,
    signedPetitions: true,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = () => {
    dispatch(logout());
    navigate("/login", {
      state: { message: "Logout Successful! Returning to Login page..." },
    });
  };

  const handleFilterChange = (key) => {
    setFilters((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const formatLabel = (key) =>
    key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());

  const handleCardClick = (cardData) => {
    setSelectedCard(cardData);
    setModalOpen(true);
  };

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
    signedPetitions: [
      {
        id: "5",
        title: "Petition for New Crosswalk",
        provider: "Bay Ridge Safety Group",
        location: "Bay Ridge, NY",
        closestAvailability: "Signed: March 1, 2025",
        image: marketing1,
        tabs: ["Safety", "Petition"],
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
                <Typography variant="h4" className="username">Peter Smith</Typography>
                <Typography variant="body2" className="location">📍 Bay Ridge, NY</Typography>
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

          {/* Filter Dropdown */}
          {showFilters && (
            <div className="filters-panel">
              {Object.entries(filters).map(([key, value]) => (
                <label key={key} style={{ display: "block", marginBottom: 8 }}>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => handleFilterChange(key)}
                    style={{ marginRight: 8 }}
                  />
                  {formatLabel(key)}
                </label>
              ))}
            </div>
          )}

          {/* Cards Section */}
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
          </div>

          {/* Optional Modal */}
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
