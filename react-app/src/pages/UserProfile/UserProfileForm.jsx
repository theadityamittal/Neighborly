import React, { useState } from "react";
import { Button, TextField, Grid, Snackbar, Alert } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "../../utils/axiosInstance";
import "./UserProfile.css";
import { updateUserInformation, getUserInformation } from "../../services/authService";
import { storeUserInformation } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";

const UserProfileForm = ({ onCancel }) => {
  const { access, name, email, phoneNumber, address} = useSelector((state) => state.auth);
  console.log(phoneNumber);
  const firstName = name.split(" ")[0];
  const lastName = name.split(" ")[1];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    firstName: firstName,
    lastName: lastName,
    email: email,
    phoneNumber: phoneNumber,
    address: address
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const newFormData = {};
      newFormData["name"] = `${formData.firstName} ${formData.lastName}`;
      newFormData["phone_number"] = formData.phoneNumber;
      newFormData["email"] = formData.email;
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
    setSnackbarOpen(false); // Close the Snackbar
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
            <TextField fullWidth disabled label="Address" value={formData.address} onChange={()=> {}} />
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
        autoHideDuration={3000} // Automatically close after 3 seconds
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
