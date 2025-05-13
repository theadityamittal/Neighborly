import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../../utils/axiosInstance";
import { TOOL_TAGS } from "../../assets/tags";

import "./Tools.css";
import AddIcon from '@mui/icons-material/Add';

import { useNavigate } from "react-router-dom"; // Import navigate
import SearchBar from "../../components/SearchBar";
import ToolCards from "./ToolCards";

const haversine = require('haversine-distance')

const Tools = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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


  

  if (loading) return <p>Loading tools...</p>;
  if (error && tools.length === 0) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <div className="tools-header">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} filterActiveContent={filterTools} resetFilter={resetTools} tagOptions={TOOL_TAGS}/>      
        {/* <div className="tools-header-btn" onClick={() => navigate("/create-tool")}>
          <AddIcon fontSize="large"/>
        </div> */}
        <button 
            className="create-button-new" 
            onClick={() => navigate("/create-tool")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            Create
          </button>
      </div>
      <ToolCards tools={tools}/>
    </div>
  );
};

export default Tools;
