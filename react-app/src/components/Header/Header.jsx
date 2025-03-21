import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Avatar, Box } from "@mui/material";
import { Notifications, Mail } from "@mui/icons-material";
import "./Header.css";
import avatar from "../../assets/avatar.png"; 
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  
  // Function to handle logo click and navigate to the home page
  const handleItemClick = (path) => {
    navigate(path); // Navigate to the home page when the logo is clicked
  };

  return (
    <AppBar position="fixed" className="header">
      <Toolbar className="header-content">
        {/* Logo Section */}
        <Box className="header-left" onClick={() => handleItemClick("/")}>
          <img src={logo} alt="Neighbourly Logo" className="logo" />
        </Box>

        {/* Icons & Profile Section */}
        <Box className="header-right">
          <IconButton className="icon-button">
            <Mail />
          </IconButton>
          <IconButton className="icon-button">
            <Notifications />
          </IconButton>

          {/* Avatar & Name */}
          <Box className="user-profile" onClick={() => handleItemClick("/profile")}>
            <Avatar src={avatar} alt="User Avatar" className="profile-pic" />
            <Typography variant="body1" className="username">Peter Smith</Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
