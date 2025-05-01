import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import PostCard from "../../components/VerticalCard/PostCard";
import CreatePost from "../../components/VerticalCard/CreatePost";
import { useNavigate } from "react-router-dom"; // Import navigate
import SearchBar from "../../components/SearchBar";
import AddIcon from "@mui/icons-material/Add"; // For plus sign icon

const Bulletin = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/bulletin/");

        const formattedPosts = response.data.map((item) => {
          const imageUrl = typeof item.image === "string" && item.image.trim() !== ""
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
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch bulletin posts:", err);
        setError("Failed to load posts.");
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleNewPost = async (newContent, selectedImageFile) => {
    try {
      const formData = new FormData();
      formData.append("title", "New Post");
      formData.append("content", newContent);
      formData.append("post_type", "announcement");
      formData.append("visibility", "public");
      formData.append("tags", JSON.stringify([]));
      formData.append("location", "Unknown");
      formData.append("city", "Unknown");
      formData.append("state", "Unknown");
      formData.append("zip_code", "");
      formData.append("neighborhood", "");
      formData.append("user_id", "1"); // Replace later with auth
      if (selectedImageFile) {
        formData.append("image", selectedImageFile);  // ✅ match key to backend
      }

      const response = await axios.post("/bulletin/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setPosts((prevPosts) => [
        {
          userName:  `${response.data.user_name}`,
          dateTime: new Date(response.data.date_posted).toLocaleString(),
          postContent: (
            <div>
              <p>{response.data.content}</p>
              
              {response.data.image && (
                <div className="mt-2">
                  <img
                    src={response.data.image}
                    alt="Post image"
                    className="max-w-xs rounded"
                  />
                </div>
              )}
              
            </div>
          ),
          firstImage: response.data.image || null,
          tags: response.data.tags || [],
        },
        ...prevPosts,
      ]);
    } catch (err) {
      console.error("Failed to create new post:", err);
      setError("Failed to create a new post.");
    }
  };

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
      {posts.length === 0 ? (
        <div>No posts available.</div>
      ) : (
        posts.map((post, index) => <PostCard key={index} {...post} />)
      )}
    </div>
  );
};

export default Bulletin;