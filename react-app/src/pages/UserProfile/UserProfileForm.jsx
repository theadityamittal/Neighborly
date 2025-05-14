import React, { useState } from "react";
import { Button, TextField, Grid, Snackbar, Alert } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "../../utils/axiosInstance";
import "./UserProfile.css";
import { updateUserInformation, getUserInformation } from "../../services/authService";
import { storeUserInformation } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";

const UserProfileForm = ({ onCancel }) => {
  const { access, name, email, phoneNumber, address, neighborhood, icon } = useSelector((state) => state.auth);
  const firstName = name.split(" ")[0];
  const lastName = name.split(" ")[1];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [saved, setSaved] = useState(false);
  const [iconPreview, setIconPreview] = useState(null);

  const [formData, setFormData] = useState({
    firstName: firstName,
    lastName: lastName,
    email: email,
    phoneNumber: phoneNumber,
    address: address,
    neighborhood: neighborhood
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      const newFormData = new FormData();
      newFormData.append("name", `${formData.firstName} ${formData.lastName}`);
      newFormData.append("phone_number", formData.phoneNumber);
      newFormData.append("email", formData.email);
      newFormData.append("address", formData.address);
      newFormData.append("neighborhood", formData.neighborhood);
      
      // Add the icon if selected
      const iconInput = document.getElementById('icon');
      if (iconInput.files[0]) {
        newFormData.append("icon", iconInput.files[0]);
      }
      
      const response = await updateUserInformation(newFormData, access);
      console.log("Profile updated successfully:", response.data);
      const userInfo = await getUserInformation(access);
      console.log("User information fetched successfully:", userInfo.data);
      dispatch((storeUserInformation(userInfo.data)));
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="profile-form-wrapper">
      <div className="profile-icon-section">
        <img 
          src={iconPreview || icon || '/default-avatar.png'} 
          alt="Profile" 
          className="profile-icon"
        />
        <label htmlFor="icon" className="upload-label">
          Change Profile Picture
        </label>
        <input
          id="icon"
          name="icon"
          type="file"
          accept="image/*"
          onChange={handleIconChange}
          className="hidden-input"
        />
      </div>

      <form className="profile-form">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField fullWidth label="First Name" value={formData.firstName} onChange={handleChange("firstName")} />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth label="Last Name" value={formData.lastName} onChange={handleChange("lastName")} />
          </Grid>
          <Grid item xs={12}>
            <TextField disabled fullWidth label="Email" value={formData.email} onChange={handleChange("email")} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Address" value={formData.address} onChange={handleChange("address")} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Neighborhood" value={formData.neighborhood} onChange={handleChange("neighborhood")} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Phone Number" value={formData.phoneNumber} onChange={handleChange("phoneNumber")} />
          </Grid>
        </Grid>

        <div className="profile-form-buttons">
          <Button variant="outlined" className="cancel-btn" onClick={onCancel}>Cancel</Button>
          <Button variant="contained" className="save-btn" onClick={handleSubmit}>Save</Button>
        </div>
      </form>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: "100%" }}>
          Successfully updated information!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default UserProfileForm;