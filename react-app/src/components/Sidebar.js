import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { List, ListItemButton, ListItemIcon, ListItemText, Box } from "@mui/material";
import { Dashboard, Build, Event, HowToVote, MiscellaneousServices } from "@mui/icons-material";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("Bulletin");
  const navigate = useNavigate();

  const menuItems = [
    { name: "Bulletin", icon: <Dashboard />, path: "/" },
    { name: "Tools", icon: <Build />, path: "/tools" },
    { name: "Services", icon: <MiscellaneousServices />, path: "/services" }, // New Services tab
    { name: "Event", icon: <Event />, path: "/events" },
    { name: "Petition", icon: <HowToVote />, path: "/petitions" }
  ];

  const handleItemClick = (item, path) => {
    setActiveItem(item);
    navigate(path);
  };

  return (
    <Box className="sidebar">
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.name}
            selected={activeItem === item.name}
            onClick={() => handleItemClick(item.name, item.path)}
            className={`menu-item ${activeItem === item.name ? "active" : ""}`}
          >
            <ListItemIcon className="menu-icon">{item.icon}</ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
