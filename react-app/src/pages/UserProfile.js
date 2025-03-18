import React, { useState } from "react";
import { Avatar, Button, Card, CardContent, CardMedia, Checkbox, FormControlLabel, Grid, Typography } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import "../styles/UserProfile.css";  // Ensure CSS styles are properly included
import avatar from "../assets/avatar.png";  // Ensure correct asset path

const UserProfile = () => {
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
        <Button variant="outlined" startIcon={<FilterList />} className="filter-button">
          Filter
        </Button>
        <div className="filter-options">
          <FormControlLabel control={<Checkbox checked={filters.tools} onChange={handleFilterChange} name="tools" />} label="Listed Tools" />
          <FormControlLabel control={<Checkbox checked={filters.services} onChange={handleFilterChange} name="services" />} label="Requested Services" />
          <FormControlLabel control={<Checkbox checked={filters.events} onChange={handleFilterChange} name="events" />} label="Hosted Events" />
          <FormControlLabel control={<Checkbox checked={filters.petitions} onChange={handleFilterChange} name="petitions" />} label="Signed Petitions" />
        </div>
      </div>

      {/* UserProfile Cards Section */}
      <Grid container spacing={3} className="bulletin-cards">
        {[1, 2].map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card className="card">
              <CardMedia
                component="img"
                height="140"
                image="https://via.placeholder.com/300"
                alt="Placeholder"
              />
              <CardContent>
                <div className="tags">
                  <Typography variant="body2" className="tag">Environment</Typography>
                  <Typography variant="body2" className="tag">Maintenance</Typography>
                </div>
                <Typography variant="h6" className="title">Title</Typography>
                <Typography variant="subtitle2" className="organizer">Organizer Name</Typography>
                <Typography variant="body2" className="desc">Short Description</Typography>
                <Typography variant="body2">411 people signed / required #</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default UserProfile;
