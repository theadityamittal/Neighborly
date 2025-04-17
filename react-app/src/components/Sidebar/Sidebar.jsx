import React from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, Box } from "@mui/material";
import { Dashboard as DashboardIcon, Build, Event as EventIcon, HowToVote, MiscellaneousServices } from "@mui/icons-material";
import "./Sidebar.css";
import { NavLink } from "react-router-dom";

const menuItems = [
  { name: "Bulletin",  path: "/bulletin",  icon: <DashboardIcon /> },
  { name: "Events",    path: "/events",    icon: <EventIcon /> },
  { name: "Tools",     path: "/tools",     icon: <Build /> },
  { name: "Services",  path: "/services",  icon: <MiscellaneousServices /> },
  { name: "Petitions", path: "/petitions", icon: <HowToVote /> },
];

const Sidebar = () => {
  return (
    <Box className="sidebar">
      <List>
        {menuItems.map(({ name, path, icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => 
              `menu-item ${isActive ? "active" : ""}`
            }
            style={{ textDecoration: "none"}}
          >
            <ListItemButton key={name} style={{ padding: "0" }}>
              <ListItemIcon className="menu-icon">{icon}</ListItemIcon>
              <ListItemText className="menu-text" primary={name}/>
            </ListItemButton>
          </NavLink>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
