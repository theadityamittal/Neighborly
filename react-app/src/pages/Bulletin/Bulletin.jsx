import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import PostCard from "../../components/VerticalCard/PostCard";
import QuickPost from "../../components/VerticalCard/QuickPost";
import SearchBar from "../../components/SearchBar";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { BULLETIN_TAGS } from "../../assets/tags";

const haversine = require('haversine-distance');

const Bulletin = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { access } = useSelector((state) => state.auth);
  const { latitude, longitude } = useSelector((state) => state.auth);
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
  };

  // Filter posts based on search term and tags and radius
  const filterPosts = (searchTerm, {tags, radius}) => {
    const filteredPosts = posts.filter((post) => {
      const titleMatch = post.content.toLowerCase().includes(searchTerm.toLowerCase());
      const tagsMatch = tags.length === 0 || post?.tags.some(t => tags.includes(t));

      const postLocation = {
        latitude: post.latitude,
        longitude: post.longitude
      };

      const userLocation = {
        latitude: latitude,
        longitude: longitude
      };
      
      const distance = haversine(postLocation, userLocation) / 1000;

      const withinRadius = radius === 0 || distance <= radius;

      return titleMatch && tagsMatch && withinRadius;
    })
    setPosts(filteredPosts);
  }

  // Reset search and reload posts
  const resetPosts = () => {
    setSearchTerm("");
    fetchPosts();
  };

  if (loading) {
    return <div className="p-6 max-w-3xl mx-auto">Loading posts...</div>;
  }

  if (error && posts.length === 0) {
    return <div className="p-6 max-w-3xl mx-auto text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="events-header">
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterActiveContent={filterPosts}
          resetFilter={resetPosts}
          tagOptions={BULLETIN_TAGS}
        />
        <div
          className="events-header-btn"
          onClick={() => navigate("/create-post")}
        >
          <AddIcon fontSize="large" />
        </div>
      </div>

      {/* Quick Post Element */}
      <QuickPost onPost={handleNewPost} />

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {posts.length === 0 ? (
          <div>No posts available.</div>
        ) : (
          posts.map((post) => (
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