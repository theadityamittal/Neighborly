import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import FormLocationPicker from "../../components/LocationPicker/FormLocationPicker";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import "./CreatePost.css";

const availableTags = [
  "Community",
  "Market",
  "Gardening",
  "Sustainability",
  "Volunteer",
  "Health",
  "Education",
];

const postTypes = ["Event", "Announcement", "Discussion"];

const CreatePost = ({ onPost = () => {} }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState(postTypes[0]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [image, setImage] = useState(null);
  const [visibility, setVisibility] = useState("public");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateRegion, setStateRegion] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleTagChange = (e) => {
    const value = e.target.value;
    if (value && !selectedTags.includes(value)) {
      setSelectedTags((prev) => [...prev, value]);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setSelectedTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    // required fields
    if (!title || !content || !postType || !visibility) {
      return alert("Please fill out all required fields.");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("post_type", postType.toLowerCase());
    formData.append("visibility", visibility);

    // append each tag separately
    selectedTags.forEach((tag) => formData.append("tags", tag));

    // optional location fields
    if (latitude != null && longitude != null) {
      formData.append("latitude", latitude.toString());
      formData.append("longitude", longitude.toString());
      formData.append("street_address", streetAddress);
      formData.append("city", city);
      formData.append("state", stateRegion);
      formData.append("zip_code", zipCode);
      formData.append("neighborhood", neighborhood);
      formData.append("location", location);
    }

    // date_posted in UTC ISO format
    formData.append("date_posted", new Date().toISOString());

    // image file if provided
    if (image) {
      formData.append("image", image);
    }

    // debug: inspect payload
    console.log("Submitting FormData:", Array.from(formData.entries()));

    try {
      const response = await axiosInstance.post("/bulletin/", formData);
      alert("Post created successfully!");
      onPost(response.data);
      navigate("/bulletin");
    } catch (err) {
      console.error("Error creating post:", err.response || err);
      const msg = err.response?.data
        ? JSON.stringify(err.response.data)
        : "Failed to create post. See console.";
      alert(msg);
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
          {/* Left Column */}
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

            <label className="input-label">Post Type</label>
            <select
              className="input"
              value={postType}
              onChange={(e) => setPostType(e.target.value)}
            >
              {postTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <label className="input-label">Tags</label>
            <select onChange={handleTagChange} className="input" defaultValue="">
              <option value="" disabled>
                Select a tag
              </option>
              {availableTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>

            <div className="selected-tags">
              {selectedTags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                  <button
                    type="button"
                    className="remove-tag-btn"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <label className="input-label">Image Upload</label>
            <input
              className="input"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          {/* Right Column */}
          <div className="form-right">
            <FormControl className="visibility-control">
              <label className="input-label">Visibility</label>
              <RadioGroup
                row
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
              setLocation={setLocation}
              onCoordinatesChange={(loc) => {
                setLatitude(loc.latitude);
                setLongitude(loc.longitude);
                setStreetAddress(loc.streetAddress);
                setCity(loc.city);
                setStateRegion(loc.state);
                setZipCode(loc.zipCode);
                setNeighborhood(loc.neighborhood);
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
