import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getVerificationForm, uploadVerificationForm, updateVerificationForm } from '../../../services/authService';
import { logout } from "../../../redux/authSlice";
import { Button } from "@mui/material";
import "./Verification.css";

const Verification = () => {
    const { access, user_id } = useSelector((state) => state.auth);
    const [uploaded, setUploaded] = useState(false);
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        const VerificationForm = async () => {
            try {
            const response = await getVerificationForm(access);
            setDescription(response.description);
            setFile(response.file);
            setUploaded(true);
            }
            catch (error) {
                console.error("Error fetching verification form:", error);
            }

        }
        VerificationForm();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
            const formData = {
              user_id: user_id,
              description: description,
              file: file,
            };

            if (uploaded) {
                try {
                    await updateVerificationForm(formData, access);
                    alert("Verification Request Uploaded Successfully!");
                    } catch (err) {
                    console.error('Registration failed:', err);
                }

            } else {
        
                try {
                await uploadVerificationForm(formData, access);
                alert("Verification Request Uploaded Successfully!");
                } catch (err) {
                console.error('Registration failed:', err);
                }
            }
    }
    const handleLogOut = () => {
        dispatch(logout());
        navigate("/login", {
          state: { message: "Logout Successful! Returning to Login page..." },
        });
    };
    
    return (
    <div className="register-container">
        <div className="register-form-wrapper">
        <h2>{uploaded ? "Edit" : "Upload"} Verification Documents</h2>
        <p>Join your neighborhood community and get verified now!</p>

        <form onSubmit={handleSubmit} className="register-form">

            <div className="form-row">
                <div className="form-group">
                    <label className="input-label"> {uploaded ? "New" : "" } Document Upload</label>
                    <input
                    className="input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                    />
                </div>
            </div>
            <div className="form-group">
                    <label htmlFor="firstName">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="5"  
                        cols="50" 
                        className="textarea"
                    />
            </div>
            <button
            type="submit"
            className="register-button"
            >
                {uploaded ? 'Upload New Documents' : 'Upload Documents'}
            </button>
        </form>

        <div className="logout-button register-form">
                <Button
                  variant="contained"
                  className="logout-btn-blue"
                  onClick={handleLogOut}
                >
                  Logout
                </Button>
              </div>
        </div>
    </div>
    );
};

export default Verification;