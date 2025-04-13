import React from "react";
import "../petitions.css";

const CreatePetition = ({setNewPetition}) => {
    return (
        <div className="create-petition-page">
            <button className="back-btn" onClick={() => setNewPetition(false)}>
            ← Back to Petitions
            </button>
            <div className="form-container">
            <h1 className="form-title">Create New Petition</h1>
            
            <label className="input-label">Title</label>
            <input className="input" placeholder="Petition Title" />

            <label className="input-label">Location</label>
            <input className="input" placeholder="Location" />

            <label className="input-label">Image URL</label>
            <input className="input" placeholder="Image URL" />

            <label className="input-label">Tags</label>
            <input className="input" placeholder="Enter tags separated by commas" />

            <label className="input-label">Petition Author</label>
            <input className="input" placeholder="Author Name" />

            <label className="input-label">Petition Date</label>
            <input className="input" type="date" />

            <label className="input-label">Voting Ends At</label>
            <input className="input" type="date" />

            <label className="input-label">Target Signatures</label>
            <input className="input" type="number" placeholder="Target number of signatures" />

            <label className="input-label">Detailed Description</label>
            <textarea className="textarea" placeholder="Enter the detailed description of your petition..." />

            <label className="input-label">Hero Image URL</label>
            <input className="input" placeholder="Hero Image URL" />

            <button className="submit-btn">Create Petition</button>
            </div>
        </div>
        );
}

export default CreatePetition;
