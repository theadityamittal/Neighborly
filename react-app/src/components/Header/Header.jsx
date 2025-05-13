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
  const { name, icon } = useSelector(selectAuth);
  
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
            <Avatar src={icon||avatar} alt="User Avatar" className="profile-pic">
              {!avatar && name?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="body1" className="username">{name}</Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
