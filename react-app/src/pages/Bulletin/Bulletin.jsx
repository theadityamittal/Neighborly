import React, { useEffect, useState } from "react";
import QuickPost from "../../components/VerticalCard/QuickPost";
import SearchBar from "../../components/SearchBar";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { BULLETIN_TAGS } from "../../assets/tags";
import BulletinCards from "./BulletinCards";
import axiosInstance from "../../utils/axiosInstance";

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
      const response = await axiosInstance.get("/bulletin/", {
        headers: { Authorization: `Bearer ${access}` },
      });
      const sorted = [...response.data].sort(
        (a, b) => new Date(b.date_posted) - new Date(a.date_posted)
      );
      console.log("Fetched posts:", response.data);
      const processed = sorted.map((post) => ({
        ...post,
        date_posted: new Date(post.date_posted).toLocaleString(),
      }));
      setPosts(processed);
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
    return <div className="bulletin-content">Loading posts...</div>;
  }

  if (error && posts.length === 0) {
    return <div className="bulletin-content">{error}</div>;
  }

  return (
    <div className="bulletin-content">
      <div className="events-header">
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterActiveContent={filterPosts}
          resetFilter={resetPosts}
          tagOptions={BULLETIN_TAGS}
        />
        {/* <div
          className="events-header-btn"
          onClick={() => navigate("/create-post")}
        >
          <AddIcon fontSize="large" />
        </div> */}
        <button 
            className="create-button-new" 
            onClick={() => navigate("/create-post")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            Create
          </button>
      </div>

      {/* Quick Post Element */}
      <QuickPost postCreate={() => fetchPosts()} />

      {/* Bulletin Cards */}
      <BulletinCards posts={posts}/>
    </div>
  );
};

export default Bulletin;