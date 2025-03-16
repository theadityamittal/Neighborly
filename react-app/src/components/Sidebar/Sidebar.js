import React, { useState } from "react";
import "./Sidebar.css";
import {
  FaChevronDown,
  FaClipboardList,
  FaTools,
  FaHandsHelping,
  FaCalendarAlt,
  FaVoteYea,
} from "react-icons/fa";

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("Bulletin");
  const [toolsOpen, setToolsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        <li
          className={`menu-item ${activeItem === "Bulletin" ? "active" : ""}`}
          onClick={() => handleItemClick("Bulletin")}
        >
          <FaClipboardList className="icon" />
          <span>Bulletin</span>
        </li>

        <li
          className={`menu-item ${activeItem === "Tools" ? "active" : ""}`}
          onClick={() => handleItemClick("Tools")}
        >
          <FaTools className="icon" />
          <span>Tools</span>
        </li>


        <li
          className={`menu-item ${activeItem === "Event" ? "active" : ""}`}
          onClick={() => handleItemClick("Event")}
        >
          <FaCalendarAlt className="icon" />
          <span>Event</span>
        </li>
        <li
          className={`menu-item ${activeItem === "Petition" ? "active" : ""}`}
          onClick={() => handleItemClick("Petition")}
        >
          <FaVoteYea className="icon" />
          <span>Petition</span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
