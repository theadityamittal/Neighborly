import React, { useState } from "react";
import { Avatar, Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authSlice";
import { useNavigate } from "react-router";

import UserProfileForm from "./UserProfileForm";
import HorizontalCardModal from "../../components/HorizontalCard/HorizontalCardModal";

import { getToolsByUser } from "../../services/toolsService";
import { getRequestedServicesByUser } from "../../services/servicesService";
import { getEventsByUser } from "../../services/eventService";
import { getPetitionsByUser } from "../../services/petitionsService";

import UserProfileTabs from "./UserProfileTabs";

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
  const [tabContent, setTabContent] = useState(null);

  // const [userCards, setUserCards] = useState({
  //   myPosts: [],
  //   listedTools: [],
  //   requestedServices: [],
  //   hostedEvents: [],
  //   signedPetitions: [],
  // });

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const [toolsRes, servicesRes, eventsRes, petitionsRes] = await Promise.all([
  //         getToolsByUser(user_id, access),
  //         getRequestedServicesByUser(user_id, access),
  //         getEventsByUser(user_id, access),
  //         getPetitionsByUser(user_id, access)
  //       ]);

  //       setUserCards({
  //         listedTools: toolsRes.data || [],
  //         requestedServices: servicesRes.data || [],
  //         hostedEvents: eventsRes.data || [],
  //         signedPetitions: petitionsRes.data || [],
  //         myPosts: [],
  //       });
  //     } catch (error) {
  //       console.error("Failed fetching user content:", error);
  //     }
  //   };

  //   fetchUserData();
  // }, []);

  const handleLogOut = () => {
    dispatch(logout());
    navigate("/login", { state: { message: "Logout Successful! Returning to Login page..." } });
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setModalOpen(true);
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

          {/* Tabs */}
          <UserProfileTabs />

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
