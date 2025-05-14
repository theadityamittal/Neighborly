import React, { useState } from "react";
import "./QuickPost.css";
import axiosInstance from "../../utils/axiosInstance";
import { useSelector } from "react-redux";

const QuickPost = ({ postCreate }) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const { name, neighborhood } = useSelector((state) => state.auth);
<<<<<<< HEAD
=======
  const { access } = useSelector((state) => state.auth);
>>>>>>> 2853bf3805e39ed850dac0c989affcba4e0192cf

  const handleQuickPost = async (e) => {
    e.preventDefault();
    // Check if the text is empty
    if (!text) {
      alert("Please enter some text.");
      return;
    }

    const formData = new FormData();
    formData.append("content", text);
    if (image) {
      formData.append("image", image);
    }
    formData.append("title", `Quick Post by ${name}`);
    formData.append("location", neighborhood);
    formData.append("post_type", "quick_post");

    try {
<<<<<<< HEAD
      await axiosInstance.post("/bulletin/", formData);
=======
      await axiosInstance.post("/bulletin/", formData, {
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-Type": "multipart/form-data",
        },
      });
>>>>>>> 2853bf3805e39ed850dac0c989affcba4e0192cf
      alert("Post created successfully!");
    } catch (err) {
      console.error("Error creating post:", err.response || err);
      const msg = err.response?.data
        ? JSON.stringify(err.response.data)
        : "Failed to create post. See console.";
      alert(msg);
    } finally {
      setText("");
      setImage(null);
      if (postCreate) {
        postCreate();
      }
    }
  }

  return (
    <div className="post-card create-post">
      <textarea
        className="create-post-text mb-3"
        placeholder="What's on your mind?"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="create-post-actions">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="text-sm"
        />
        <button
          onClick={handleQuickPost}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 text-sm font-semibold"
        >
          Post
        </button>
      </div>
    </div>
  );
};
export default QuickPost;