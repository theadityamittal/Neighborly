import React, { useState } from "react";
import { Button, TextField, Grid, MenuItem } from "@mui/material";
import "./UserProfile.css";

const UserProfileForm = ({ onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    contact: "",
    city: "",
    state: "",
    password: "",
  });

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  return (
    <div className="profile-form-wrapper">
      <form className="profile-form">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField fullWidth label="First Name" value={formData.firstName} onChange={handleChange("firstName")} />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth label="Last Name" value={formData.lastName} onChange={handleChange("lastName")} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Email" value={formData.email} onChange={handleChange("email")} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Address" value={formData.address} onChange={handleChange("address")} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Contact Number" value={formData.contact} onChange={handleChange("contact")} />
          </Grid>
          <Grid item xs={6}>
            <TextField
              select
              fullWidth
              label="City"
              value={formData.city}
              onChange={handleChange("city")}
            >
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="CA">CA</MenuItem>
              <MenuItem value="New York">New York</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              select
              fullWidth
              label="State"
              value={formData.state}
              onChange={handleChange("state")}
            >
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="CA">CA</MenuItem>
              <MenuItem value="NY">NY</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange("password")}
            />
          </Grid>
        </Grid>

        <div className="profile-form-buttons">
          <Button variant="outlined" className="cancel-btn" onClick={onCancel}>Cancel</Button>
          <Button variant="contained" className="save-btn">Save</Button>
        </div>
      </form>
    </div>
  );
};

export default UserProfileForm;
