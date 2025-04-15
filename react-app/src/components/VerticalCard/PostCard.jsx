import React from "react";
import "./PostCard.css";

const PostCard = ({ userName, dateTime, postContent, tags }) => {
  return (
    <div className="post-card">
      {/* User info */}
      <div className="post-card-header">
  <span className="user-name">{userName}</span>
  <span className="date-time">• {dateTime}</span>
</div>


      {/* Post content */}
      <div className="post-card-body text-base text-gray-800">
        {typeof postContent === "string" ? (
          <p>{postContent}</p>
        ) : (
          <div className="post-card-content-wrapper">{postContent}</div>
        )}
      </div>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="post-card-tags mt-4 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="post-tag"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostCard;
