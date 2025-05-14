import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Avatar, Box } from "@mui/material";
import { Notifications, Mail } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { selectAuth } from "../../redux/authSlice";
import "./Header.css";
import avatar from "../../assets/avatar.png"; 
import logo from "../../assets/logo-purple.png";
import { useNavigate } from "react-router";

const Header = () => {
  const navigate = useNavigate();
  const { name, icon, accountType } = useSelector(selectAuth);
  const isNGO = accountType === "NGO";
  
  return (
    <AppBar position="fixed" className="header" elevation={0}>
      <Toolbar className="header-content">
        {/* Logo Section */}
        <Box className="header-left" onClick={() => navigate("/")}>
          <div className="brand-container">
            <img src={logo} alt="Neighbourly Logo" className="logo" />
          </div>
        </Box>

        {/* Profile Section */}
        <Box className="header-right">
          <Box className="user-profile" onClick={() => navigate("/profile")}>
            <div className="avatar-wrapper">
              <Avatar src={icon||avatar} alt="User Avatar" className="profile-pic">
                {!icon && name?.charAt(0).toUpperCase()}
              </Avatar>
              {isNGO && <div className="ngo-badge-small">NGO</div>}
            </div>
            <Typography variant="body1" className="username">{name}</Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;