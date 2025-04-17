import React, { useState } from "react";
import PostCard from "../../components/VerticalCard/PostCard";
import CreatePost from "../../components/VerticalCard/CreatePost";
import photo1 from "../../assets/img/photo1.jpg";

const Bulletin = () => {
  const [posts, setPosts] = useState([
    {
      userName: "Jane Smith",
      dateTime: "April 11, 2025, 9:45AM",
      postContent: "Had a wonderful time at the weekend market!",
      tags: ["Community", "Market"],
    },
    {
      userName: "Maya Ali",
      dateTime: "April 11, 2025 • 3:00 PM",
      postContent: (
        <div>
          <p>Check out this beautiful community garden we worked on today!</p>
          <img src={photo1} alt="Community garden" />
        </div>
      ),
      tags: ["Gardening", "Community", "Sustainability"],
    },
  ]);

  const handleNewPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h2 className="text-xl font-bold">Community Posts</h2>
      <CreatePost onPost={handleNewPost} />

      {posts.map((post, index) => (
        <PostCard key={index} {...post} />
      ))}
    </div>
  );
};

export default Bulletin;
