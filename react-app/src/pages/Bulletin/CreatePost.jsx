import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import "./CreatePost.css";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("tags", tags);
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

        <button className="submit-btn" type="submit">
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;