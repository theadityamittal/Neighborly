import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import axiosInstance from '../../../utils/axiosInstance';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Assuming you're using Material UI
import HorizontalCardModalEdit from '../../../components/HorizontalCard/HorizontalCardModalEdit';
import './EditTool.css';

const EditTool = () => {
    const { tool_id } = useParams();
    const [toolDetails, setToolDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedEdit, setSelectedEdit] = useState(false);
    const [error, setError] = useState(null);
    const { access } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const handleClose = () => {
        setSelectedEdit(false);
    };

    useEffect(() => {
        const fetchTool = async () => {
    
        try {
            const response = await axiosInstance.get(`tools/${tool_id}`, {
            headers: {
                Authorization: `Bearer ${access}`,
                "Content-Type": "multipart/form-data",
            }
            });
            console.log(response.data)
            setToolDetails(response.data);

        } catch (err) {
            console.error("Error fetching tool details:", err);
            setError("Failed to load tool details. Please try again later.");
        } finally {
            setLoading(false);
        }
        };
    
        fetchTool();
    }, [access, tool_id]);

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
            <div className="tool-tags">
                {toolDetails.tags && toolDetails.tags.map((tag, index) => (
                    <span key={index} className="tool-tag">{tag}</span>
                ))}
            </div>
        </div>
        <h1 className="tool-title">{toolDetails.title}</h1>
        <div className="tool-content">
            <div className="tool-main-info">
            <div className="tool-author">
                <span className="meta-label">Created by: You</span>
            </div>
            <div className="tool-hero">
                <img 
                src={toolDetails.images} 
                alt={toolDetails.title} 
                className="tool-hero-image"
                />
            </div>
            <div className="tool-meta">
                <div className="tool-date">
                <span className="meta-label">Date:</span> {new Date(toolDetails.date_posted).toLocaleDateString()}
                </div>
                <div className="tool-location">
                <span className="meta-label">Location:</span> {toolDetails.location}
                </div>
            </div>
            <div className="tool-date">
                <span className="meta-label">Visibility:</span> {toolDetails.visibility}
            </div>
            <h2 className="description-title">Description</h2>
            {toolDetails.description}
            <div className="tool-description"></div>
            </div>
            <div className="tool-description-container">
                {/* <div>
                    <h2 className="description-title">List of Borrowers</h2>
                    <p className="tool-description">{
                    toolDetails.borrow_requests.map((index, b) => (
                        <div key={b.user_id || index}>{b.messages}</div>
                    ))}</p>
                </div> */}
                <div className="tool-cta"></div>
                    <button className="sign-tool-button" onClick={() => setSelectedEdit(!selectedEdit)}>Edit this Tool</button>
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
        </div>
    );
};

export default EditTool;