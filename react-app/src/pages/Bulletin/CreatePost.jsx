import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import FormLocationPicker from "../../components/LocationPicker/FormLocationPicker";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import "./CreatePost.css";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);
  const [visibility, setVisibility] = useState("public");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateRegion, setStateRegion] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    if (!latitude || !longitude) {
      alert("Please select a location on the map.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("tags", tags);
    formData.append("visibility", visibility);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("street_address", streetAddress);
    formData.append("city", city);
    formData.append("state", stateRegion);
    formData.append("zip_code", zipCode);
    formData.append("location", location);
    if (image) formData.append("image", image);

    try {
      await axiosInstance.post("/api/bulletin/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Post created successfully!");
      navigate("/bulletin");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="create-post-page">
      <button className="back-btn" onClick={() => navigate("/bulletin")}>
        ← Back to Bulletin
      </button>
      <form className="form-container" onSubmit={handlePostSubmit}>
        <h1 className="form-title">Create New Post</h1>

        <div className="two-column-row">
          {/* Left Column: Form Fields */}
          <div className="form-left">
            <label className="input-label">Title</label>
            <input
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <label className="input-label">Content</label>
            <textarea
              className="textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />

            <label className="input-label">Tags (comma-separated)</label>
            <input
              className="input"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />

            <label className="input-label">Image Upload</label>
            <input
              className="input"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          {/* Right Column: Map Selector and Visibility */}
          <div className="form-right">
            <FormControl className="visibility-control">
              <label className="input-label">Visibility</label>
              <RadioGroup
                row
                aria-labelledby="visibility-group-label"
                name="visibility"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
              >
                <FormControlLabel
                  value="public"
                  control={<Radio />}
                  label="Public"
                />
                <FormControlLabel
                  value="neighborhood"
                  control={<Radio />}
                  label="Neighborhood Only"
                />
                <FormControlLabel
                  value="invitation"
                  control={<Radio />}
                  label="Invitation Only"
                />
              </RadioGroup>
            </FormControl>

            <FormLocationPicker
              location={location}
              setLocation={(val) => setLocation(val)}
              onCoordinatesChange={(loc) => {
                setLatitude(loc.latitude);
                setLongitude(loc.longitude);
                setStreetAddress(loc.streetAddress);
                setCity(loc.city);
                setStateRegion(loc.state);
                setZipCode(loc.zipCode);
              }}
            />
          </div>
        </div>

        <button className="submit-btn" type="submit">
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;