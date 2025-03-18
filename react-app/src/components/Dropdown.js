import React, { useState } from "react";
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText, Avatar, Checkbox, Divider } from "@mui/material";
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded"; // Import the filter icon
import AccountCircle from "@mui/icons-material/AccountCircle";
import "../styles/Dropdown.css"; // Import CSS

const UiDropdown = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [filters, setFilters] = useState({
    tools: true,
    services: true,
    events: true,
    petitions: true
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFilterChange = (key) => {
    setFilters({ ...filters, [key]: !filters[key] });
  };

  return (
    <div>
      {/* Filter Icon Button */}
      <IconButton onClick={handleClick} className="filter-icon">
        <FilterAltRoundedIcon fontSize="large" />
      </IconButton>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{ className: "dropdown-menu" }} // Apply CSS class
      >
        
        {[
          { key: "posts", label: "My Posts"},
          { key: "tools", label: "Listed Tools"},
          { key: "services", label: "Requested Services"},
          { key: "events", label: "Hosted Events"},
          { key: "petitions", label: "Signed Petitions"},
        ].map((item) => (
          <MenuItem key={item.key} onClick={() => handleFilterChange(item.key)} className="dropdown-item">
            <ListItemText primary={item.label} />
            <Checkbox
              checked={filters[item.key]}
              onChange={() => handleFilterChange(item.key)}
              className="dropdown-checkbox"
            />
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default UiDropdown;
