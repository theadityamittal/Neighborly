import React, { useState } from "react";
import PostCard from "../../components/VerticalCard/PostCard";
import CreatePost from "../../components/VerticalCard/CreatePost";
import photo1 from "../../assets/img/photo1.jpg";
import { useNavigate } from "react-router-dom"; // Import navigate
import SearchBar from "../../components/SearchBar";
import AddIcon from "@mui/icons-material/Add"; // For plus sign icon

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

  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleNewPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const filterPosts = (searchTerm) => {
    const filteredPosts = posts.filter((post) =>
      post.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setPosts(filteredPosts);
  };

  const resetPosts = () => {
    setSearchTerm("");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Community Posts Title */}
      <h2 className="text-2xl font-bold mb-6">Community Posts</h2>

      {/* Header Section (Mirroring Events Page) */}
      <div className="events-header">
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterActiveContent={filterPosts}
          resetFilter={resetPosts}
        />
        {/* Create New Post Button */}
        <div
          className="events-header-btn"
          onClick={() => navigate("/create-post")}
        >
          <AddIcon fontSize="large" />
        </div>
      </div>

      {/* Create Post Form */}
      <CreatePost onPost={handleNewPost} />

      {/* Render Posts */}
      {posts.map((post, index) => (
        <PostCard key={index} {...post} />
      ))}
    </div>
  );
};

export default Bulletin;
