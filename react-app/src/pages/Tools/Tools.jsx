import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../../utils/axiosInstance";
import HorizontalCard from "../../components/HorizontalCard/HorizontalCard";
import HorizontalCardModal from "../../components/HorizontalCard/HorizontalCardModal";
import dummyTools from "./toolsData.json"; // your local fixture file
import "./Tools.css";

// Iamges
import drill1 from "../../assets/img/drill1.jpg";
import mower1 from "../../assets/img/mower1.jpg";
import wrench1 from "../../assets/img/wrench1.jpg";
import chainsaw1 from "../../assets/img/chainsaw1.jpg";
import carjack1 from "../../assets/img/carjack1.jpg";
import { useNavigate } from "react-router-dom"; // Import navigate

const Tools = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedToolId, setSelectedToolId] = useState(null);
  const { access } = useSelector((state) => state.auth);
  const navigate = useNavigate(); // Initialize navigate for redirection

  useEffect(() => {
    const fetchTools = async () => {
      setLoading(true);

      // ▶️ LOCAL MOCK: uncomment to force using local JSON
      // setTools(dummyTools);
      // setLoading(false);
      // return;

      try {
        const res = await axiosInstance.get("/api/tools/", {
          headers: { Authorization: `Bearer ${access}` },
        });
        setTools(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch tools:", err);
        setError("Could not load tools from server, showing local data.");
        setTools(dummyTools);
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, [access]);
  
  const handleView = (id) => setSelectedToolId(id);
  const handleClose = () => setSelectedToolId(null);

  const selectedTool = tools.find((t) => t.id === selectedToolId);
  const selectedToolWithDisable = selectedTool
    ? { ...selectedTool, disableBeforeToday: true }
    : null;

  if (loading) return <p>Loading tools...</p>;
  if (error && tools.length === 0) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Upcoming Tools</h1>

      {/* Create New Tool Button */}
      <button
        onClick={() => navigate("/tools/create")}
        className="create-tool-btn"
      >
        + Create New Tool
      </button>
      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(2, 1fr)",
        }}
      >
        {tools.map((tool) => (
          <HorizontalCard
            key={tool.id}
            id={tool.id}
            title={tool.name}
            description={tool.description}
            tags={[tool.condition]}       // show condition as a tag
            available={tool.availability}
            image=""                      // no image on tools, or add a placeholder URL
            onView={() => handleView(tool.id)}
          />
        ))}
      </div>

      {selectedToolWithDisable && (
        <HorizontalCardModal
          isOpen={!!selectedTool}
          onClose={handleClose}
          item={selectedToolWithDisable}
          type="tool"  // must match your API prefix if used
        />
      )}
    </div>
  );
};

export default Tools;
