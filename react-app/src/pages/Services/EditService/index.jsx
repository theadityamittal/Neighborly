import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import axiosInstance from '../../../utils/axiosInstance';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HorizontalCardModalEdit from '../../../components/HorizontalCard/HorizontalCardModalEdit';
import './EditService.css';

const EditService = () => {
    const { service_id } = useParams();
    const [serviceDetails, setServiceDetails] = useState(null);
    const [selectedEdit, setSelectedEdit] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [signups, setSignups] = useState([]);
    const [updating, setUpdating] = useState(null);
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
            console.log(response.data);
            setServiceDetails(response.data);
            // Sort signups by date (newest first)
            const sortedSignups = response.data.servicesignup?.sort((a, b) => 
                new Date(b.signed_at) - new Date(a.signed_at)
            ) || [];
            setSignups(sortedSignups);
        } catch (err) {
            console.error("Error fetching service details:", err);
            setError("Failed to load service details. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleSignupAction = async (signupId, action) => {
        setUpdating(signupId);
        try {
            const response = await axiosInstance.patch(
                `services/signup/${signupId}/`,
                { status: action },
                {
                    headers: {
                        Authorization: `Bearer ${access}`,
                        "Content-Type": "application/json",
                    }
                }
            );
            
            if (response.status === 200) {
                // Update the local state to reflect the change
                setSignups(signups.map(signup => 
                    signup.signup_id === signupId 
                        ? { ...signup, status: action }
                        : signup
                ));
                
                // Show success message
                const message = action === 'accepted' 
                    ? 'Signup accepted successfully' 
                    : 'Signup rejected successfully';
                console.log(message);
            }
        } catch (err) {
            console.error(`Error ${action} signup:`, err);
        } finally {
            setUpdating(null);
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
            </div>
            
            {/* Service Details Section */}
            <div className="service-section">
                <h1 className="service-title">{serviceDetails.title}</h1>
                
                <div className="service-content">
                    <div className="service-image-side">
                        {serviceDetails.images ? (
                            <img 
                                src={serviceDetails.images} 
                                alt={serviceDetails.title} 
                                className="service-image"
                            />
                        ) : (
                            <div className="no-image">No image available</div>
                        )}
                        
                        {/* Moved edit button under the image */}
                        <button className="edit-button" onClick={() => setSelectedEdit(!selectedEdit)}>
                            Edit this Service
                        </button>
                    </div>
                    
                    <div className="service-details-side">
                        <div className="service-meta">
                            <div className="meta-item">
                                <span className="meta-label">CREATED BY</span>
                                <span className="meta-value">You</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">DATE</span>
                                <span className="meta-value">{new Date(serviceDetails.date_posted).toLocaleDateString()}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">LOCATION</span>
                                <span className="meta-value">{serviceDetails.location}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">VISIBILITY</span>
                                <span className="meta-value">{serviceDetails.visibility}</span>
                            </div>
                        </div>
                        
                        <div className="description-section">
                            <h3 className="description-title">DESCRIPTION</h3>
                            <div className="service-description-text">{serviceDetails.description || 'No description provided'}</div>
                        </div>
                        
                        {serviceDetails.tags && serviceDetails.tags.length > 0 && (
                            <div className="tags-section">
                                <h3 className="tags-title">TAGS</h3>
                                <div className="service-tags-list">
                                    {serviceDetails.tags.map((tag, index) => (
                                        <span key={index} className="service-tag-item">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Service Signups Section */}
            <div className="signups-section">
                <h2 className="signups-title">Service Sign Ups</h2>
                
                {signups.length === 0 ? (
                    <div className="no-signups">No sign ups yet</div>
                ) : (
                    <div className="signups-table-container">
                        <table className="signups-table">
                            <thead>
                                <tr>
                                    <th>Date Requested</th>
                                    <th>Participant</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Message</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {signups.map((signup) => (
                                    <tr key={signup.signup_id}>
                                        <td>{new Date(signup.signed_at).toLocaleDateString()}</td>
                                        <td>
                                            <div className="participant-cell">
                                                {signup.user_details?.icon && (
                                                    <img 
                                                        src={signup.user_details.icon} 
                                                        alt={signup.user_details.name}
                                                        className="participant-icon"
                                                    />
                                                )}
                                                <span className="participant-name">
                                                    {signup.user_details?.name || 'User ' + signup.user_id}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            {signup.start_date 
                                                ? new Date(signup.start_date).toLocaleDateString()
                                                : 'Not specified'}
                                        </td>
                                        <td>
                                            {signup.end_date 
                                                ? new Date(signup.end_date).toLocaleDateString()
                                                : 'Not specified'}
                                        </td>
                                        <td className="message-cell">
                                            <div className="message-content">
                                                {signup.messages || 'No message'}
                                            </div>
                                        </td>
                                        <td>
                                            <span 
                                                className={`status-badge status-${signup.status}`}
                                            >
                                                {signup.status.charAt(0).toUpperCase() + signup.status.slice(1)}
                                            </span>
                                        </td>
                                        <td>
                                            {signup.status === 'pending' && (
                                                <div className="action-buttons">
                                                    <button
                                                        className="accept-button"
                                                        onClick={() => handleSignupAction(signup.signup_id, 'accepted')}
                                                        disabled={updating === signup.signup_id}
                                                    >
                                                        {updating === signup.signup_id ? 'Processing...' : 'Accept'}
                                                    </button>
                                                    <button
                                                        className="reject-button"
                                                        onClick={() => handleSignupAction(signup.signup_id, 'rejected')}
                                                        disabled={updating === signup.signup_id}
                                                    >
                                                        {updating === signup.signup_id ? 'Processing...' : 'Reject'}
                                                    </button>
                                                </div>
                                            )}
                                            {signup.status !== 'pending' && (
                                                <span className="action-completed">
                                                    {signup.status === 'accepted' ? 'Accepted' : 'Rejected'}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
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
    );
};

export default EditService;