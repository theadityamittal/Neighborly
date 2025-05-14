import React, { useEffect, useState } from "react";
<<<<<<< HEAD
import axios from "../../utils/axiosInstance";
import PostCard from "../../components/VerticalCard/PostCard";
=======
>>>>>>> 2853bf3805e39ed850dac0c989affcba4e0192cf
import QuickPost from "../../components/VerticalCard/QuickPost";
import SearchBar from "../../components/SearchBar";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { BULLETIN_TAGS } from "../../assets/tags";
<<<<<<< HEAD
=======
import BulletinCards from "./BulletinCards";
import axiosInstance from "../../utils/axiosInstance";
>>>>>>> 2853bf3805e39ed850dac0c989affcba4e0192cf

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
<<<<<<< HEAD
      const response = await axios.get("/bulletin/", {
=======
      const response = await axiosInstance.get("/bulletin/", {
>>>>>>> 2853bf3805e39ed850dac0c989affcba4e0192cf
        headers: { Authorization: `Bearer ${access}` },
      });
      const sorted = [...response.data].sort(
        (a, b) => new Date(b.date_posted) - new Date(a.date_posted)
      );
      console.log("Fetched posts:", response.data);
<<<<<<< HEAD

      setPosts(sorted);
=======
      const processed = sorted.map((post) => ({
        ...post,
        date_posted: new Date(post.date_posted).toLocaleString(),
      }));
      setPosts(processed);
>>>>>>> 2853bf3805e39ed850dac0c989affcba4e0192cf
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
<<<<<<< HEAD
    return <div className="p-6 max-w-3xl mx-auto">Loading posts...</div>;
  }

  if (error && posts.length === 0) {
    return <div className="p-6 max-w-3xl mx-auto text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
=======
    return <div className="bulletin-content">Loading posts...</div>;
  }

  if (error && posts.length === 0) {
    return <div className="bulletin-content">{error}</div>;
  }

  return (
    <div className="bulletin-content">
>>>>>>> 2853bf3805e39ed850dac0c989affcba4e0192cf
      <div className="events-header">
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterActiveContent={filterPosts}
          resetFilter={resetPosts}
          tagOptions={BULLETIN_TAGS}
        />
<<<<<<< HEAD
        <div
=======
        {/* <div
>>>>>>> 2853bf3805e39ed850dac0c989affcba4e0192cf
          className="events-header-btn"
          onClick={() => navigate("/create-post")}
        >
          <AddIcon fontSize="large" />
<<<<<<< HEAD
        </div>
=======
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
>>>>>>> 2853bf3805e39ed850dac0c989affcba4e0192cf
      </div>

      {/* Quick Post Element */}
      <QuickPost postCreate={() => fetchPosts()} />

<<<<<<< HEAD
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
=======
      {/* Bulletin Cards */}
      <BulletinCards posts={posts}/>
>>>>>>> 2853bf3805e39ed850dac0c989affcba4e0192cf
    </div>
  );
};

export default Bulletin;