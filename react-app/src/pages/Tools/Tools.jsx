import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../../utils/axiosInstance";
import HorizontalCard from "../../components/HorizontalCard/HorizontalCard";
import HorizontalCardModal from "../../components/HorizontalCard/HorizontalCardModal";
import { TOOL_TAGS } from "../../assets/tags";

import "./Tools.css";
import AddIcon from '@mui/icons-material/Add';

import { useNavigate } from "react-router-dom"; // Import navigate
import SearchBar from "../../components/SearchBar";

const haversine = require('haversine-distance')

const Tools = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTool, setSelectedTool] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { latitude, longitude } = useSelector((state) => state.auth);
  const { access } = useSelector((state) => state.auth);
  const navigate = useNavigate(); // Initialize navigate for redirection

  const fetchTools = async () => {
    setLoading(true);

    // ▶️ LOCAL MOCK: uncomment to force using local JSON
    // setTools(dummyTools);
    // setLoading(false);
    // return;

    try {
      const res = await axiosInstance.get("/tools/", {
        headers: { Authorization: `Bearer ${access}` },
      });
      console.log("Fetched tools:", res.data);
      setTools(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch tools:", err);
      setError("Could not load tools from server, showing local data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, [access]);


  const filterTools = (searchTerm, {tags, radius}) => {
    console.log(tools);
    console.log(searchTerm);
    console.log(tags);
    console.log(radius);
    const filteredTools = tools.filter((tool) => {
      const titleMatch = tool.title.toLowerCase().includes(searchTerm.toLowerCase());
      const tagsMatch = tags.length === 0 || tool?.tags.some(t => tags.includes(t));

      const toolLocation = {
        latitude: tool.latitude,
        longitude: tool.longitude
      };

      const userLocation = {
        latitude: latitude,
        longitude: longitude
      };
      
      const distance = haversine(toolLocation, userLocation) / 1000;

      console.log("Distance:", distance, "Radius:", radius);

      const withinRadius = radius === 0 || distance <= radius;

      return titleMatch && tagsMatch && withinRadius;
    })

    setTools(filteredTools);
  }

  const resetTools = () => {
    setSearchTerm("");
    fetchTools();
  }
  
  const handleView = (id) => {
    const selectedTool = tools.find((tool) => tool.tool_id === id);
    setSelectedTool(selectedTool);
  };

  const handleClose = () => {
    setSelectedTool(null);
  }

  if (loading) return <p>Loading tools...</p>;
  if (error && tools.length === 0) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <div className="tools-header">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} filterActiveContent={filterTools} resetFilter={resetTools} tagOptions={TOOL_TAGS}/>
        <div className="tools-header-btn" onClick={() => navigate("/create-tool")}>
          <AddIcon fontSize="large"/>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(2, 1fr)",
        }}
      >
        {tools.map((tool) => (
          <HorizontalCard
            key={tool.tool_id}
            id={tool.tool_id}
            title={tool.title}
            description={tool.description}
            location={tool.neighborhood}
            price={tool.price}
            tags={[tool.condition]}      
            available={tool.available}
            image={tool.images?.[0]}                   
            onView={() => handleView(tool.tool_id)}
          />
        ))}
      </div>

      {selectedTool && (
        <HorizontalCardModal
          isOpen={!!selectedTool}
          onClose={handleClose}
          item={selectedTool}
          type="tool"  // must match your API prefix if used
          api_key="borrow"
        />
      )}
    </div>
  );
};

export default Tools;
