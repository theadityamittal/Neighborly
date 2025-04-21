import React, { useState, useEffect } from "react";
import { Avatar, Button, Typography } from "@mui/material";
import avatar from "../../assets/avatar.png";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authSlice";
import { useNavigate } from "react-router";
import UserProfileForm from "./UserProfileForm";
import HorizontalCard from "../../components/HorizontalCard/HorizontalCard";
import HorizontalCardModal from "../../components/HorizontalCard/HorizontalCardModal";
import VerticalCard from "../../components/VerticalCard/VerticalCard";
import petitionData from "../Petitions/petitionData.json";
import "./UserProfile.css";
import { getEventsByUser } from "../../services/eventService";

// Images
import yoga1 from "../../assets/img/yoga1.jpg";
import cooking1 from "../../assets/img/cooking1.jpg";
import tree1 from "../../assets/img/tree1.jpg";
import pilates1 from "../../assets/img/pilates1.jpg";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const { access, user_id } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { name, neighborhood } = useSelector((state) => state.auth);

  const [activeTabs, setActiveTabs] = useState(["myPosts"]);

  const toggleTab = (key) => {
    setActiveTabs((prev) =>
      prev.includes(key)
        ? prev.filter((t) => t !== key)
        : [...prev, key]
    );
  };

  useEffect(() => {
    const getEventsUser = async () => {
      try {
        const response = await getEventsByUser({ organizer_id: user_id }, access);
        return response.data;
      } catch (error) {
        console.error(error);
      }
    };
    getEventsUser();
  }, [user_id, access]);

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
      {
        id: "6",
        title: "Community Garden Day",
        provider: "Local Group",
        location: "Bay Ridge, NY",
        closestAvailability: "April 15, 2025",
        image: pilates1,
        tabs: ["Community", "Gardening"],
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
      {
        id: "7",
        title: "Drill Available",
        provider: "DIY Depot",
        location: "Brooklyn, NY",
        closestAvailability: "Available Now",
        image: tree1,
        tabs: ["Tools", "Power"],
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
      {
        id: "8",
        title: "Tech Help Needed",
        provider: "Linda Reyes",
        location: "Bay Ridge, NY",
        closestAvailability: "April 4, 2025",
        image: cooking1,
        tabs: ["Request", "Technology"],
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
      {
        id: "9",
        title: "Craft Workshop",
        provider: "Bay Arts",
        location: "Bay Ridge, NY",
        closestAvailability: "April 18, 2025",
        image: yoga1,
        tabs: ["Events", "Crafts"],
      },
    ],
    signedPetitions: petitionData.slice(0, 2),
  };

  return (
    <>
      {isEditing ? (
        <UserProfileForm onCancel={() => setIsEditing(false)} />
      ) : (
        <>
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

          {/* Interest Tabs */}
          <div className="interest-tabs">
            {Object.keys(cardData).map((key) => (
              <button
                key={key}
                className={`interest-tab ${activeTabs.includes(key) ? "active" : ""}`}
                onClick={() => toggleTab(key)}
              >
                {formatLabel(key)}
              </button>
            ))}
          </div>

          {/* Card Grid */}
          <div className="bulletin-cards">
            {activeTabs.map((key) =>
              cardData[key]?.slice(0, 2).map((card) =>
                key === "signedPetitions" ? (
                  <VerticalCard
                    key={card.id}
                    id={card.id}
                    title={card.title}
                    provider={card.provider}
                    location={card.location}
                    closestAvailability={card.closestAvailability}
                    image={card.image}
                    tabs={card.tabs}
                    numberSigned={card.numberSigned}
                    handleClick={() => handlePetitionClick(card)}
                  />
                ) : (
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
                )
              )
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
    </>
  );
};

export default UserProfile;
