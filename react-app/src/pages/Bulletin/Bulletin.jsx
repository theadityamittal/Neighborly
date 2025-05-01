// import React, { useState } from "react";
// import PostCard from "../../components/VerticalCard/PostCard";
// import CreatePost from "../../components/VerticalCard/CreatePost";
// import photo1 from "../../assets/img/photo1.jpg";

// const Bulletin = () => {
//   const [posts, setPosts] = useState([
//     {
//       userName: "Jane Smith",
//       dateTime: "April 11, 2025, 9:45AM",
//       postContent: "Had a wonderful time at the weekend market!",
//       tags: ["Community", "Market"],
//     },
//     {
//       userName: "Maya Ali",
//       dateTime: "April 11, 2025 • 3:00 PM",
//       postContent: (
//         <div>
//           <p>Check out this beautiful community garden we worked on today!</p>
//           <img src={photo1} alt="Community garden" />
//         </div>
//       ),
//       tags: ["Gardening", "Community", "Sustainability"],
//     },
//   ]);

//   const handleNewPost = (newPost) => {
//     setPosts([newPost, ...posts]);
//   };

//   return (
//     <div className="p-6 max-w-3xl mx-auto space-y-6">
//       <h2 className="text-xl font-bold">Community Posts</h2>
//       <CreatePost onPost={handleNewPost} />

//       {posts.map((post, index) => (
//         <PostCard key={index} {...post} />
//       ))}
//     </div>
//   );
// };

// export default Bulletin;


import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import PostCard from "../../components/VerticalCard/PostCard";
import CreatePost from "../../components/VerticalCard/CreatePost";

const Bulletin = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/bulletin/");
        console.log(response.data);

        const formattedPosts = response.data.map((item) => {
          const imageUrl = typeof item.images === "string" && item.images.trim() !== ""
            ? item.images
            : null;
        
          return {
            userName: `${item.user_name}`,
            dateTime: item.date_posted
              ? new Date(item.date_posted).toLocaleString()
              : "Unknown Date",
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

  const handleNewPost = async (newContent, selectedImageFiles) => {
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

      if (selectedImageFiles && selectedImageFiles.length > 0) {
        selectedImageFiles.forEach((file) => {
          // formData.append("images", file);
          formData.append("upload_images", file); 
        });
      }

      const response = await axios.post("/bulletin/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Post created:", response.data);

      setPosts((prevPosts) => [
        {
          userName:  `User ${response.data.user_name}`,
          dateTime: new Date(response.data.date_posted).toLocaleString(),
          postContent: (
            <div>
              <p>{response.data.content}</p>
              
              {response.data.images && (
                <div className="mt-2">
                  <img
                    src={response.data.images}
                    alt="Post image"
                    className="max-w-xs rounded"
                  />
                </div>
              )}
              
            </div>
          ),
          firstImage: response.data.images || null,
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
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h2 className="text-xl font-bold">Community Posts</h2>
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