import React, { useState } from "react";
import "./QuickPost.css";

const QuickPost = ({ onPost }) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const handlePost = () => {
    if (!text.trim() && !image) return;
    onPost(text, image); // <-- Only send raw text + image File

    setText("");
    setImage(null);
  };

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
          onClick={handlePost}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 text-sm font-semibold"
        >
          Post
        </button>
      </div>
    </div>
  );
};
export default QuickPost;