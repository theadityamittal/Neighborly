import { Avatar, Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authSlice";
import { useNavigate } from "react-router";
import UserProfileForm from "./UserProfileForm";
import "./UserProfile.css";
import UserProfileTabs from "./UserProfileTabs";
import avatar from "../../assets/avatar.png";
import "./UserProfile.css";
import React, { useState } from "react";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { name, neighborhood, icon, accountType } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);

  const isNGO = accountType === "NGO";

  const handleLogOut = () => {
    dispatch(logout());
    navigate("/login", { state: { message: "Logout Successful! Returning to Login page..." } });
  };

  return (
    <>
      {isEditing ? (
        <UserProfileForm onCancel={() => setIsEditing(false)} />
      ) : (
        <>

          {/* Header */}
          <div className={`bulletin-header ${isNGO ? 'ngo-header' : ''}`}>
            <div className="profile">
              <div className="profile-icon-wrapper">
                <Avatar src={icon || avatar} alt="User Avatar" sx={{ width: 80, height: 80 }} />
                {isNGO && <div className="ngo-badge-avatar">NGO</div>}
              </div>
              <div>
                <Typography variant="h4" className="username">
                  {name}
                  {isNGO && (
                    <span className="ngo-verified-badge">✓ Verified NGO</span>
                  )}
                </Typography>
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
        </>
      )}
    </>
  );
};

export default UserProfile;