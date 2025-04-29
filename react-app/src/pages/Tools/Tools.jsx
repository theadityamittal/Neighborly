import React, { useState, useEffect, use } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../../utils/axiosInstance";
import HorizontalCard from "../../components/HorizontalCard/HorizontalCard";
import HorizontalCardModal from "../../components/HorizontalCard/HorizontalCardModal";

import "./Tools.css";
import AddIcon from '@mui/icons-material/Add';

import { useNavigate } from "react-router-dom"; // Import navigate
import SearchBar from "../../components/SearchBar";

const Tools = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTool, setSelectedTool] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
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


  const filterTools = (searchTerm) => {
    const filteredTools = tools.filter((tool) => {
      const titleMatch = tool.name.toLowerCase().includes(searchTerm.toLowerCase());
      return titleMatch;
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
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} filterActiveContent={filterTools} resetFilter={resetTools}/>
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
