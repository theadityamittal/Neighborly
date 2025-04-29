import React, { useState, useEffect } from "react";
import { Avatar, Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authSlice";
import { useNavigate } from "react-router";

import UserProfileForm from "./UserProfileForm";
import HorizontalCard from "../../components/HorizontalCard/HorizontalCard";
import VerticalCard from "../../components/VerticalCard/VerticalCard";
import HorizontalCardModal from "../../components/HorizontalCard/HorizontalCardModal";

import { getToolsByUser } from "../../services/toolsService";
import { getRequestedServicesByUser } from "../../services/servicesService";
import { getEventsByUser } from "../../services/eventService";
import { getPetitionsByUser } from "../../services/petitionsService";


import avatar from "../../assets/avatar.png";
import "./UserProfile.css";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { name, neighborhood, user_id, access } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedTab, setSelectedTab] = useState("myPosts");

  const [userCards, setUserCards] = useState({
    myPosts: [],
    listedTools: [],
    requestedServices: [],
    hostedEvents: [],
    signedPetitions: [],
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [toolsRes, servicesRes, eventsRes, petitionsRes] = await Promise.all([
          getToolsByUser(user_id, access),
          getRequestedServicesByUser(user_id, access),
          getEventsByUser({ organizer_id: user_id }, access),
          getPetitionsByUser(user_id, access)

        ]);

        setUserCards({
          listedTools: toolsRes.data || [],
          requestedServices: servicesRes.data || [],
          hostedEvents: eventsRes.data || [],
          signedPetitions: petitionsRes.data || [],
          myPosts: [],
        });
      } catch (error) {
        console.error("Failed fetching user content:", error);
      }
    };

    fetchUserData();
  }, [user_id, access]);

  const handleLogOut = () => {
    dispatch(logout());
    navigate("/login", { state: { message: "Logout Successful! Returning to Login page..." } });
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setModalOpen(true);
  };

  const formatTabLabel = (key) => key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

  const TABS = ["myPosts", "listedTools", "requestedServices", "hostedEvents", "signedPetitions"];

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
                <Button variant="contained" className="edit-profile-btn" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              </div>
              <div className="right-button">
                <Button variant="contained" className="logout-btn-blue" onClick={handleLogOut}>
                  Logout
                </Button>
              </div>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="tabs-selector">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${selectedTab === tab ? "active" : ""}`}
                onClick={() => setSelectedTab(tab)}
              >
                {formatTabLabel(tab)}
              </button>
            ))}
          </div>

          {/* Cards Section */}
          <div className="bulletin-cards">
            {userCards[selectedTab]?.length > 0 ? (
              userCards[selectedTab].map((card) => (
                <HorizontalCard
  key={card.id || card.tool_id}
  title={card.title || card.name}
  provider={card.provider || card.owner_name}
  location={card.location || card.city || card.neighborhood}
  closestAvailability={card.closestAvailability || "N/A"}
  image={card.image || card.images?.[0] || avatar}
  tabs={card.tabs || [card.condition]}
  onView={() => handleCardClick(card)}
/>

              ))
            ) : (
              <Typography variant="body2">No data available for {formatTabLabel(selectedTab)}</Typography>
            )}
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
