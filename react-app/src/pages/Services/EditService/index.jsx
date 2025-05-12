import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import axiosInstance from '../../../utils/axiosInstance';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Assuming you're using Material UI
import HorizontalCardModalEdit from '../../../components/HorizontalCard/HorizontalCardModalEdit';
import './EditService.css'; // Assuming you have a CSS file for styling

const EditService = () => {
    const { service_id } = useParams();
    const [serviceDetails, setServiceDetails] = useState(null);
    const [selectedEdit, setSelectedEdit] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { access } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const handleClose = () => {
        setSelectedEdit(false);
    };

    const fetchService = async () => {

        try {
            const response = await axiosInstance.get(`/services/${service_id}/`, {
            headers: {
                Authorization: `Bearer ${access}`,
                "Content-Type": "multipart/form-data",
            }
            });
            console.log(response.data)
            setServiceDetails(response.data);
        } catch (err) {
            console.error("Error fetching service details:", err);
            setError("Failed to load service details. Please try again later.");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchService();
    }, [access, service_id]);

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (loading || !serviceDetails) {
        return <div className="loading">Loading Service details...</div>;
    }

    return (
    <div className="detailed-service-container">
    <div className="service-header">
        <button className="back-button" onClick={() => navigate(-1)}>
        <ArrowBackIcon /> Back
        </button>
        <div className="service-tags">
        {serviceDetails.tags && serviceDetails.tags.map((tag, index) => (
            <span key={index} className="service-tag">{tag}</span>
        ))}
        </div>
    </div>
    <h1 className="service-title">{serviceDetails.title}</h1>
    <div className="service-content">
        <div className="service-main-info">
        <div className="service-author">
            <span className="meta-label">Created by: You</span>
        </div>
        <div className="service-hero">
            <img 
            src={serviceDetails.images} 
            alt={serviceDetails.title} 
            className="service-hero-image"
            />
        </div>
        <div className="service-meta">
            <div className="service-date">
            <span className="meta-label">Date:</span> {new Date(serviceDetails.date_posted).toLocaleDateString()}
            </div>
            <div className="service-location">
            <span className="meta-label">Location:</span> {serviceDetails.location}
            </div>
        </div>
        <div className="service-location">
            <span className="meta-label">Visibility:</span> {serviceDetails.visibility}
        </div>
        <h2 className="description-title">Description</h2>

        <div className="service-description">{serviceDetails.description}</div>
        </div>
        <div className="service-description-container">
        {/* <div>
            <h2 className="description-title">List of Sign Ups</h2>
            <p className="service-description">{
            serviceDetails.servicesignup.map((participant) => (
                <div>{participant.user.name}</div>

            ))}</p>
        </div> */}
        <div className="service-cta">
            <button className="sign-service-button" onClick={() => setSelectedEdit(!selectedEdit)}>Edit this Service</button>
        </div>
            {selectedEdit && (
            <HorizontalCardModalEdit
            isOpen={!!selectedEdit}
            onClose={handleClose}
            item={{
                image: serviceDetails.images,
                description: serviceDetails.description,
                title: serviceDetails.title,
                id: serviceDetails.service_id,
                visibility: serviceDetails.visibility,
                location: serviceDetails.location,
                latitude: serviceDetails.latitude,
                longitude: serviceDetails.longitude,
            }}
            type="Service"
            api="services"
            />
        )}
        </div>
    </div>
    </div>
    );
};

export default EditService;