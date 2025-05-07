import React from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, Box } from "@mui/material";
import { Dashboard as DashboardIcon, Build, Event as EventIcon, HowToVote, MiscellaneousServices } from "@mui/icons-material";
import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuth } from "../../redux/authSlice";

const menuItems = [
  { name: "Bulletin",  path: "/bulletin",  icon: <DashboardIcon />, subCategory: false},
  { name: "Events",    path: "/events",    icon: <EventIcon />, subCategory: false },
  // { name: "My Events", path: "/myEvents",  icon: <EventIcon />, subCategory: true },
  { name: "Tools",     path: "/tools",     icon: <Build />, subCategory: false },
  // { name: "My Tools",  path: "/MyTools",   icon: <Build />, subCategory: true},
  { name: "Services",  path: "/services",  icon: <MiscellaneousServices />, subCategory: false },
  // { name: "My Services", path: "/MyServices", icon: <MiscellaneousServices />, subCategory: true},
  { name: "Petitions", path: "/petitions", icon: <HowToVote />, subCategory: false },
  // { name: "My Petitions", path: "/myPetitions", icon: <MiscellaneousServices />, subCategory: true},
];

const Sidebar = () => {
  const { is_staff } = useSelector(selectAuth);

  return (
    <Box className="sidebar">
      <List>
        {menuItems.map(({ name, path, icon, subCategory }) => 
          !subCategory ? (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => 
                `menu-item ${isActive ? "active" : ""}`
              }
              style={{ textDecoration: "none" }}
            >
              <ListItemButton style={{ padding: "0" }}>
                <ListItemIcon className="menu-icon">{icon}</ListItemIcon>
                <ListItemText className="menu-text" primary={name} />
              </ListItemButton>
            </NavLink>
          ) : (
            <NavLink
            key={path}
            to={path}
            className={({ isActive }) => 
              `menu-item ${isActive ? "active" : ""}`
            }
            style={{ textDecoration: "none" }}
            >
              <ListItemButton style={{ padding: "0" }}>
              <span className="inline-space" />
              <ListItemText
                className="menu-text"
                primary={name}
                primaryTypographyProps={{ sx: { fontSize: '14px' } }}
              />
              </ListItemButton>
            </NavLink>
          )
        )}
        { is_staff ? (
              <NavLink
                key={'/newUserApps'}
                to={"/newUserApps"}
                className={({ isActive }) => 
                  `menu-item ${isActive ? "active" : ""}`
                }
                style={{ textDecoration: "none"}}
              >
                <ListItemButton key={"NewUserApps"} style={{ padding: "0" }}>
                  <ListItemIcon className="menu-icon">{<MiscellaneousServices />}</ListItemIcon>
                  <ListItemText className="menu-text" primary={"NewUserApps"}/>
                </ListItemButton>
              </NavLink>)
            :
              <></>
        }
      </List>
    </Box>
  );
};

export default Sidebar;
