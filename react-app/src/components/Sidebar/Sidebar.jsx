import React from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, Box } from "@mui/material";
import "./Sidebar.css";

const Sidebar = ({menuItems, activeItem, handleItemClick}) => {
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
            <ListItemText primary={item.name}/>
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
