import React, { useState, useEffect } from "react";
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
  const [selectedToolId, setSelectedToolId] = useState(null);
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
  }, []);

  const filterTools = (searchTerm) => {
    const filteredTools = Array.isArray(tools) ? tools.filter((tool) => {
      const titleMatch = tool.name.toLowerCase().includes(searchTerm.toLowerCase());
      return titleMatch;
    }) : [];

    setTools(filteredTools);
  }

  const resetTools = () => {
    setSearchTerm("");
    fetchTools();
  }
  
  const handleView = (id) => setSelectedToolId(id);
  const handleClose = () => setSelectedToolId(null);

  const selectedTool = Array.isArray(tools) ? tools.find((t) => t.id === selectedToolId) : null;
  const selectedToolWithDisable = selectedTool
    ? { ...selectedTool, disableBeforeToday: true }
    : null;

  if (loading) return <p>Loading tools...</p>;
  if (error && Array.isArray(tools) && tools.length === 0) return <p style={{ color: "red" }}>{error}</p>;

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
        {Array.isArray(tools) ? tools.map((tool) => (
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
            onView={() => handleView(tool.id)}
          />
        )) : <></>}
      </div>

      {selectedToolWithDisable && (
        <HorizontalCardModal
          isOpen={!!selectedTool}
          onClose={handleClose}
          item={selectedToolWithDisable}
          type="tool"  // must match your API prefix if used
          api_key="borrow"
        />
      )}
    </div>
  );
};

export default Tools;
