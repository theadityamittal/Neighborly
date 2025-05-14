import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import axiosInstance from '../../../utils/axiosInstance';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HorizontalCardModalEdit from '../../../components/HorizontalCard/HorizontalCardModalEdit';
import './EditTool.css';

const EditTool = () => {
    const { tool_id } = useParams();
    const [toolDetails, setToolDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedEdit, setSelectedEdit] = useState(false);
    const [error, setError] = useState(null);
    const [rsvpRequests, setRsvpRequests] = useState([]);
    const [updating, setUpdating] = useState(null);
    const { access } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const handleClose = () => {
        setSelectedEdit(false);
    };

    const fetchTool = async () => {
        try {
            const response = await axiosInstance.get(`/tools/${tool_id}/`, {
                headers: {
                    Authorization: `Bearer ${access}`,
                }
            });
            console.log(response.data);
            setToolDetails(response.data);
            // Sort borrow requests by date (newest first)
            const sortedRequests = response.data.borrow_requests?.sort((a, b) => 
                new Date(b.signed_at) - new Date(a.signed_at)
            ) || [];
            setRsvpRequests(sortedRequests);
        } catch (err) {
            console.error("Error fetching tool details:", err);
            setError("Failed to load tool details. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTool();
    }, [access, tool_id]);

    const handleRsvpAction = async (signupId, action) => {
        setUpdating(signupId);
        try {
            const response = await axiosInstance.patch(
                `/tools/borrow/${signupId}/`,
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
                setRsvpRequests(rsvpRequests.map(req => 
                    req.signup_id === signupId 
                        ? { ...req, status: action }
                        : req
                ));
                
                // Show success message
                const message = action === 'accepted' 
                    ? 'Request accepted successfully' 
                    : 'Request rejected successfully';
                // You might want to add a toast notification here
                console.log(message);
            }
        } catch (err) {
            console.error(`Error ${action} request:`, err);
            // Handle error - maybe show a toast notification
        } finally {
            setUpdating(null);
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'accepted':
                return '#22c55e'; // Less vibrant green
            case 'rejected':
                return '#ef4444'; // Less vibrant red
            default:
                return '#fbbf24'; // Less vibrant amber for pending
        }
    };

    const getStatusStyles = (status) => {
        switch(status) {
            case 'accepted':
                return {
                    backgroundColor: '#22c55e',
                    color: 'white'
                };
            case 'rejected':
                return {
                    backgroundColor: '#ef4444',
                    color: 'white'
                };
            default:
                return {
                    backgroundColor: '#fbbf24',
                    color: 'white'
                };
        }
    };

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (loading || !toolDetails) {
        return <div className="loading">Loading Tool details...</div>;
    }

    return (
        <div className="detailed-tool-container">
            <div className="tool-header">
                <button className="back-button" onClick={() => navigate("/profile")}>
                    <ArrowBackIcon /> Back
                </button>
            </div>
            
            {/* Tool Details Section */}
            <div className="tool-section">
                <h1 className="tool-title">{toolDetails.title}</h1>
                
                <div className="tool-content">
                    <div className="tool-image-side">
                        {toolDetails.images ? (
                            <img 
                                src={toolDetails.images} 
                                alt={toolDetails.title} 
                                className="tool-image"
                            />
                        ) : (
                            <div className="no-image">No image available</div>
                        )}
                        
                        {/* Moved edit button under the image */}
                        <button className="edit-button" onClick={() => setSelectedEdit(!selectedEdit)}>
                            Edit this Tool
                        </button>
                    </div>
                    
                    <div className="tool-details-side">
                        <div className="tool-meta">
                            <div className="meta-item">
                                <span className="meta-label">CREATED BY</span>
                                <span className="meta-value">You</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">DATE</span>
                                <span className="meta-value">{new Date(toolDetails.date_posted).toLocaleDateString()}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">LOCATION</span>
                                <span className="meta-value">{toolDetails.location}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">VISIBILITY</span>
                                <span className="meta-value">{toolDetails.visibility}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">CONDITION</span>
                                <span className="meta-value">{toolDetails.condition}</span>
                            </div>
                            {toolDetails.price && (
                                <div className="meta-item">
                                    <span className="meta-label">PRICE</span>
                                    <span className="meta-value">${toolDetails.price}</span>
                                </div>
                            )}
                        </div>
                        
                        <div className="description-section">
                            <h3 className="description-title">DESCRIPTION</h3>
                            <div className="tool-description-text">{toolDetails.description || 'No description provided'}</div>
                        </div>
                        
                        {toolDetails.tags && toolDetails.tags.length > 0 && (
                            <div className="tags-section">
                                <h3 className="tags-title">TAGS</h3>
                                <div className="tool-tags-list">
                                    {toolDetails.tags.map((tag, index) => (
                                        <span key={index} className="tool-tag">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* RSVP Requests Section */}
            <div className="rsvp-section">
                <h2 className="rsvp-title">Borrow Requests</h2>
                
                {rsvpRequests.length === 0 ? (
                    <div className="no-requests">No borrow requests yet</div>
                ) : (
                    <div className="rsvp-table-container">
                        <table className="rsvp-table">
                            <thead>
                                <tr>
                                    <th>Date Requested</th>
                                    <th>Requester</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Message</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rsvpRequests.map((request) => (
                                    <tr key={request.signup_id}>
                                        <td>{new Date(request.signed_at).toLocaleDateString()}</td>
                                        <td>
                                            <div className="requester-cell">
                                                {request.user_details?.icon && (
                                                    <img 
                                                        src={request.user_details.icon} 
                                                        alt={request.user_details.name}
                                                        className="requester-icon"
                                                    />
                                                )}
                                                <span className="requester-name">
                                                    {request.user_details?.name || 'User ' + request.user_id}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            {request.start_date 
                                                ? new Date(request.start_date).toLocaleDateString()
                                                : 'Not specified'}
                                        </td>
                                        <td>
                                            {request.end_date 
                                                ? new Date(request.end_date).toLocaleDateString()
                                                : 'Not specified'}
                                        </td>
                                        <td className="message-cell">
                                            <div className="message-content">
                                                {request.messages || 'No message'}
                                            </div>
                                        </td>
                                        <td>
                                            <span 
                                                className="status-badge"
                                                style={getStatusStyles(request.status)}
                                            >
                                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                            </span>
                                        </td>
                                        <td>
                                            {request.status === 'pending' && (
                                                <div className="action-buttons">
                                                    <button
                                                        className="accept-button"
                                                        onClick={() => handleRsvpAction(request.signup_id, 'accepted')}
                                                        disabled={updating === request.signup_id}
                                                    >
                                                        {updating === request.signup_id ? 'Processing...' : 'Accept'}
                                                    </button>
                                                    <button
                                                        className="reject-button"
                                                        onClick={() => handleRsvpAction(request.signup_id, 'rejected')}
                                                        disabled={updating === request.signup_id}
                                                    >
                                                        {updating === request.signup_id ? 'Processing...' : 'Reject'}
                                                    </button>
                                                </div>
                                            )}
                                            {request.status !== 'pending' && (
                                                <span className="action-completed">
                                                    {request.status === 'accepted' ? 'Accepted' : 'Rejected'}
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
                        image: toolDetails.images,
                        description: toolDetails.description,
                        title: toolDetails.title,
                        id: toolDetails.tool_id,
                        visibility: toolDetails.visibility,
                        location: toolDetails.location,
                        longitude: toolDetails.longitude,
                        latitude: toolDetails.latitude,
                    }}
                    type="Tool"
                    api="tools/update_tool"
                />
            )}
        </div>
    );
};

export default EditTool;