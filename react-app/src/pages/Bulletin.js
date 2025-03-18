import React, { useState } from "react";
import { Avatar, Button, Card, CardContent, CardMedia, Checkbox, FormControlLabel, Grid, Typography } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import "../styles/Bulletin.css";  // Ensure CSS styles are properly included
import avatar from "../assets/avatar.png";
import UiDropdown from "../components/Dropdown";


const Bulletin = () => {
  // Checkbox filter states
  const [filters, setFilters] = useState({
    tools: true,
    services: true,
    events: true,
    petitions: true
  });

  const handleFilterChange = (event) => {
    setFilters({ ...filters, [event.target.name]: event.target.checked });
  };

  return (
    <div className="main-content">
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
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <UiDropdown />
      </div>

      {/* Bulletin Cards Section */}
      
    </div>
  );
};

export default Bulletin;
