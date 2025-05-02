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
  const { access, user_id } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Helper to normalize API item → PostCard props
  const formatItem = (item) => {
    const imageUrl =
      typeof item.image === "string" && item.image.trim() !== ""
        ? item.image
        : null;

    return {
      userName: item.user_name,
      dateTime: item.date_posted
        ? new Date(item.date_posted).toLocaleString()
        : "Unknown Date",
      rawDate: new Date(item.date_posted),
      postContent: (
        <div className="space-y-2">
          <p className="text-gray-700">{item.content}</p>
          {imageUrl && (
            <div className="mt-2">
              <img
                src={imageUrl}
                alt="Bulletin image"
                className="max-w-xs rounded"
              />
            </div>
          )}
        </div>
      ),
      firstImage: imageUrl,
      tags: item.tags || [],
    };
  };

  // Initial full fetch
  const fetchPosts = async () => {
    try {
      const response = await axios.get("/bulletin/", {
        headers: { Authorization: `Bearer ${access}` },
      });
      const formatted = response.data
        .map(formatItem)
        .sort((a, b) => b.rawDate - a.rawDate);

      setPosts(formatted);
      setFilteredPosts(formatted);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [access, user_id]);

  // === NEW: only prepend the single new post ===
  const handleNewPost = (newItem) => {
    const formatted = formatItem(newItem);

    setPosts((prev) => [formatted, ...prev]);
    setFilteredPosts((prev) => [formatted, ...prev]);
  };

  const handleSearch = (term) => {
    const filtered = posts.filter((post) =>
      post.postContent.props.children[0]
        .toLowerCase()
        .includes(term.toLowerCase())
    );
    setFilteredPosts(filtered);
  };

  if (loading) {
    return <div className="p-6 max-w-3xl mx-auto">Loading posts...</div>;
  }

  if (error) {
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
          resetFilter={() => setFilteredPosts(posts)}
        />
        <div
          className="events-header-btn"
          onClick={() => navigate("/create-post")}
        >
          <AddIcon fontSize="large" />
        </div>
      </div>

      {/* pass handleNewPost so CreatePost injects just the new item */}
      <CreatePost onPost={handleNewPost} />

      {filteredPosts.length === 0 ? (
        <div>No posts available.</div>
      ) : (
        filteredPosts.map((post, index) => <PostCard key={index} {...post} />)
      )}
    </div>
  );
};

export default Bulletin;
