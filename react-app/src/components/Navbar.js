import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Avatar, Box } from "@mui/material";
import { Notifications, Mail } from "@mui/icons-material";
import "../styles/Navbar.css";
import avatar from "../assets/avatar.png"; 
import logo from "../assets/logo.png";

const Navbar = () => {
  return (
    <AppBar position="fixed" className="navbar">
      <Toolbar className="navbar-content">
        {/* Logo Section */}
        <Box className="navbar-left">
          <img src={logo} alt="Neighbourly Logo" className="logo" />
        </Box>

        {/* Icons & Profile Section */}
        <Box className="navbar-right">
          <IconButton className="icon-button">
            <Mail />
          </IconButton>
          <IconButton className="icon-button">
            <Notifications />
          </IconButton>

          {/* Avatar & Name */}
          <Box className="user-profile">
            <Avatar src={avatar} alt="User Avatar" className="profile-pic" />
            <Typography variant="body1" className="username">Peter Smith</Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
