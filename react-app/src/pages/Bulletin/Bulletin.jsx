import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import PostCard from "../../components/VerticalCard/PostCard";
import CreatePost from "../../components/VerticalCard/CreatePost";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SearchBar from "../../components/SearchBar";
import AddIcon from "@mui/icons-material/Add";
import bulletinData from "./bulletinData.json"; // Import local mock data
import photo1 from "../../assets/img/photo1.jpg";

const Bulletin = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]); // For filtered results
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const { access, user_id } = useSelector((state) => state.auth); // Get access and user_id
  const navigate = useNavigate();

  // Fetch all bulletin posts
  const fetchPosts = async () => {
    if (!access || !user_id) {
      console.error("User is not authenticated.");
      setError("User is not authenticated.");
      setLoading(false);
      return;
    }

    try {
      console.log("Fetching posts from API...");
      const response = await axios.get("/api/bulletin-items/", {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

      console.log("Fetched posts from API:", response.data);

      const formattedPosts = response.data.map((item) => {
        const imageUrl =
          typeof item.image === "string" && item.image.trim() !== ""
            ? item.image
            : null;

        return {
          userName: `${item.user_name}`,
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
      });

      formattedPosts.sort((a, b) => b.rawDate - a.rawDate);

      setPosts(formattedPosts);
      setFilteredPosts(formattedPosts); // Initialize filtered posts
      setLoading(false);
    } catch (err) {
      console.error("API call failed. Falling back to local data:", err);
      console.log("Using local mock data");

      const formattedPosts = bulletinData.map((item) => {
        const imageUrl =
          typeof item.image === "string" && item.image.trim() !== ""
            ? item.image
            : null;

        return {
          userName: `${item.user_name}`,
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
                    src={photo1}
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
      });

      formattedPosts.sort((a, b) => b.rawDate - a.rawDate);

      setPosts(formattedPosts);
      setFilteredPosts(formattedPosts); // Initialize filtered posts
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [access, user_id]);

  if (loading) {
    return <div className="p-6 max-w-3xl mx-auto">Loading posts...</div>;
  }

  if (error) {
    return <div className="p-6 max-w-3xl mx-auto text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Community Posts Title */}
      <h2 className="text-2xl font-bold mb-6">Community Posts</h2>

      {/* Header Section */}
      <div className="events-header">
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterActiveContent={(term) => {
            const filtered = posts.filter((post) =>
              post.postContent.props.children[0]
                .toLowerCase()
                .includes(term.toLowerCase())
            );
            setFilteredPosts(filtered);
          }}
          resetFilter={() => setFilteredPosts(posts)}
        />
        <div
          className="events-header-btn"
          onClick={() => navigate("/create-post")}
        >
          <AddIcon fontSize="large" />
        </div>
      </div>

      {/* Create Post Form */}
      <CreatePost onPost={() => fetchPosts()} />
      {filteredPosts.length === 0 ? (
        <div>No posts available.</div>
      ) : (
        filteredPosts.map((post, index) => <PostCard key={index} {...post} />)
      )}
    </div>
  );
};

export default Bulletin;