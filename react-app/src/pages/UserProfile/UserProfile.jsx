import React from "react";
import { Avatar, Button, Typography } from "@mui/material";
import "./UserProfile.css" 
import avatar from "../../assets/avatar.png";
import UiDropdown from "../../components/UiDropdown/UiDropdown";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import { useNavigate } from "react-router";

const UserProfle = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = () => {
    dispatch(logout());
    navigate('/login', { state: { message: 'Logout Successful! Returning to Login page...' } });
  }
  return (
    <>
      {/* User Profile Header */}
      <div className="bulletin-header">
        <div className="profile">
          <Avatar src={avatar} alt="User Avatar" sx={{ width: 80, height: 80 }} />
          <div>
            <Typography variant="h4" className="username">Peter Smith</Typography>
            <Typography variant="body2" className="location">📍 Bay Ridge, NY</Typography>
          </div>
        </div>
        <Button variant="contained" className="edit-profile-btn">Edit Profile</Button>
        <Button variant="outlined" className="logout-btn" onClick={handleLogOut}>Logout</Button>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <UiDropdown />
      </div>

      {/* UserProfle Cards Section */}
    </>
  );
};
export default UserProfle;