import React from "react";
import "./Post.css";

const Post = () => {
  return (
    <div className="post-container">
      <p className="post-text">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec scelerisque rutrum ex eu tempor. Ut lacus tortor, vulputate laoreet nunc non, mattis venenatis velit.
      </p>
      <p className="post-location">📍 Bay Ridge, NY</p>
      <div className="post-actions">
        <button className="primary-button">Edit Profile</button>
        <button className="primary-button">Events</button>
        <button className="primary-button">Services</button>
      </div>
    </div>
  );
};

export default Post;
