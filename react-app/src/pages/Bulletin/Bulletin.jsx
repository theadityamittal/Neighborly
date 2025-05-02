import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import PostCard from "../../components/VerticalCard/PostCard";
import CreatePost from "../../components/VerticalCard/CreatePost";
import SearchBar from "../../components/SearchBar";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Bulletin = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { access } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Fetch posts from the backend
  const fetchPosts = async () => {
    setLoading(true);

    try {
      const response = await axios.get("/bulletin/", {
        headers: { Authorization: `Bearer ${access}` },
      });
      const sorted = [...response.data].sort(
        (a, b) => new Date(b.date_posted) - new Date(a.date_posted)
      );
      console.log("Fetched posts:", response.data);

      setPosts(sorted);
      setFilteredPosts(sorted); // Initialize filtered posts
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Could not load posts from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [access]);

  const handleNewPost = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
    setFilteredPosts((prev) => [newPost, ...prev]);
  };

  // Handle search functionality
  const handleSearch = (term) => {
    const filtered = posts.filter((post) => {
      const titleMatch = post.title.toLowerCase().includes(term.toLowerCase());
      const contentMatch = post.content.toLowerCase().includes(term.toLowerCase());
      return titleMatch || contentMatch;
    });

    setFilteredPosts(filtered);
  };

  // Reset search and reload posts
  const resetPosts = () => {
    setSearchTerm("");
    setFilteredPosts(posts);
  };

  if (loading) {
    return <div className="p-6 max-w-3xl mx-auto">Loading posts...</div>;
  }

  if (error && posts.length === 0) {
    return <div className="p-6 max-w-3xl mx-auto text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold mb-6">Community Posts</h2>

      <div className="events-header">
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterActiveContent={handleSearch}
          resetFilter={resetPosts}
        />
        <div
          className="events-header-btn"
          onClick={() => navigate("/create-post")}
        >
          <AddIcon fontSize="large" />
        </div>
      </div>

      {/* Quick Post Element */}
      <CreatePost onPost={handleNewPost} />

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {filteredPosts.length === 0 ? (
          <div>No posts available.</div>
        ) : (
          filteredPosts.map((post) => (
            <PostCard
              key={post.post_id}
              userName={post.user_name}
              dateTime={new Date(post.date_posted).toLocaleString()}
              postContent={post.content}
              tags={post.tags}
              image={post.image}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Bulletin;