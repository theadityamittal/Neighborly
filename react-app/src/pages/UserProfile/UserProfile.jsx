// UserProfile.jsx (Final Fixed Version)

import React, { useState, useEffect } from "react";
import { Avatar, Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";

import UserProfileForm from "./UserProfileForm";
import HorizontalCard from "../../components/HorizontalCard/HorizontalCard";
import VerticalCard from "../../components/VerticalCard/VerticalCard";
import HorizontalCardModal from "../../components/HorizontalCard/HorizontalCardModal";

import { getMyPosts } from "../../services/userProfileService";
import { getToolsByUser } from "../../services/toolsService";
import { getRequestedServicesByUser } from "../../services/servicesService";
import { getEventsByUser } from "../../services/eventService";
import { getSignedPetitionsByUser } from "../../services/petitionsService";

import avatar from "../../assets/avatar.png";

import "./UserProfile.css";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("myPosts");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const { access, user_id, name, neighborhood } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [tools, setTools] = useState([]);
  const [services, setServices] = useState([]);
  const [events, setEvents] = useState([]);
  const [petitions, setPetitions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, toolsRes, servicesRes, eventsRes, petitionsRes] = await Promise.all([
          getMyPosts(user_id, access),
          getToolsByUser(user_id, access),
          getRequestedServicesByUser(user_id, access),
          getEventsByUser({ organizer_id: user_id }, access),
          getSignedPetitionsByUser(user_id, access)
        ]);

        setPosts(postsRes.data);
        setTools(toolsRes.data);
        setServices(servicesRes.data);
        setEvents(eventsRes.data);
        setPetitions(petitionsRes.data);
      } catch (error) {
        console.error("❌ Failed to load user profile data:", error);
      }
    };

    fetchData();
  }, [access, user_id]);

  const handleLogOut = () => {
    dispatch(logout());
    navigate("/login", { state: { message: "Logout successful" } });
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setModalOpen(true);
  };

  const formatLabel = (key) => key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

  const cardData = {
    myPosts: posts.map((post) => ({
      id: post.id,
      title: post.title,
      provider: post.created_by_name || "Community",
      location: post.location || "Unknown",
      closestAvailability: post.available_date || "N/A",
      image: post.image || avatar,
      tags: post.tags || [],
    })),
    listedTools: tools.map((tool) => ({
      id: tool.id,
      title: tool.name,
      provider: tool.lender_name || "Lender",
      location: tool.neighborhood || "Unknown",
      closestAvailability: tool.available_date || "N/A",
      image: tool.image || avatar,
      tags: [tool.condition],
    })),
    requestedServices: services.map((service) => ({
      id: service.id,
      title: service.title,
      provider: service.requester_name || "Resident",
      location: service.location || "Unknown",
      closestAvailability: service.date_requested || "N/A",
      image: service.image || avatar,
      tags: service.tags || [],
    })),
    hostedEvents: events.map((event) => ({
      id: event.id,
      title: event.title,
      provider: event.organizer_name || "Organizer",
      location: event.location || "Unknown",
      closestAvailability: event.event_date || "N/A",
      image: event.image || avatar,
      tags: event.tags || [],
    })),
    signedPetitions: petitions.map((petition) => ({
      id: petition.id,
      title: petition.title,
      provider: petition.author_name || "Citizen",
      location: petition.location || "Unknown",
      closestAvailability: petition.created_date || "N/A",
      image: petition.image || avatar,
      tags: petition.tags || [],
    })),
  };

  return (
    <div>
      {isEditing ? (
        <UserProfileForm onCancel={() => setIsEditing(false)} />
      ) : (
        <>
          <div className="bulletin-header">
            <div className="profile">
              <Avatar src={avatar} alt="User Avatar" sx={{ width: 80, height: 80 }} />
              <div>
                <Typography variant="h4">{name}</Typography>
                <Typography variant="body2">📍 {neighborhood}</Typography>
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

          {/* Tabs */}
          <div className="interest-tabs">
            {Object.keys(cardData).map((key) => (
              <button
                key={key}
                className={`interest-tab ${activeTab === key ? "active" : ""}`}
                onClick={() => setActiveTab(key)}
              >
                {formatLabel(key)}
              </button>
            ))}
          </div>

          {/* Cards */}
          <div className="bulletin-cards">
            {cardData[activeTab]?.length > 0 ? (
              cardData[activeTab].map((card) => (
                activeTab === "signedPetitions" ? (
                  <VerticalCard
                    key={card.id}
                    id={card.id}
                    title={card.title}
                    provider={card.provider}
                    location={card.location}
                    closestAvailability={card.closestAvailability}
                    image={card.image}
                    tabs={card.tags}
                    handleClick={() => handleCardClick(card)}
                  />
                ) : (
                  <HorizontalCard
                    key={card.id}
                    title={card.title}
                    provider={card.provider}
                    location={card.location}
                    closestAvailability={card.closestAvailability}
                    image={card.image}
                    tags={card.tags}
                    onView={() => handleCardClick(card)}
                  />
                )
              ))
            ) : (
              <p style={{ marginTop: "2rem" }}>No data available for {formatLabel(activeTab)}</p>
            )}
          </div>

          {modalOpen && selectedCard && (
            <HorizontalCardModal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              data={selectedCard}
            />
          )}
        </>
      )}
    </div>
  );
};

export default UserProfile;
