import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Avatar, Box } from "@mui/material";
import { Notifications, Mail } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { selectAuth } from "../../redux/authSlice";
import "./Header.css";
import avatar from "../../assets/avatar.png"; 
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router";

const Header = () => {
  const navigate = useNavigate();

  const { name } = useSelector(selectAuth);
  
  return (
    <AppBar position="fixed" className="header">
      <Toolbar className="header-content">
        {/* Logo Section */}
        <Box className="header-left" onClick={() => navigate("/")}>
          <img src={logo} alt="Neighbourly Logo" className="logo" />
        </Box>

        {/* Icons & Profile Section */}
        <Box className="header-right" >
          {/* <IconButton className="icon-button" onClick={() => handleItemClick("/messages")}>
            <Mail />
          </IconButton>
          <IconButton className="icon-button" onClick={() => handleItemClick("/notifications")}>
            <Notifications />
          </IconButton> */}

          {/* Avatar & Name */}
          <Box className="user-profile" onClick={() => navigate("/profile")}>
            <Avatar src={avatar} alt="User Avatar" className="profile-pic" />
            <Typography variant="body1" className="username">{name}</Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
