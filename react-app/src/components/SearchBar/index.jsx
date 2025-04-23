import React, { useState } from "react";
import {
    Box,
    IconButton,
    Menu,
    Typography,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Slider
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import "./SearchBar.css";

const SearchBar = ({ searchTerm, setSearchTerm, filterActiveContent, resetFilter, tagOptions=[] }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [selectedTags, setSelectedTags] = useState([]);
    const [radius, setRadius] = useState(50);

    const handleFilterClick = (e) => setAnchorEl(e.currentTarget);
    const handleFilterClose = () => setAnchorEl(null);

    const toggleTag = (tag) => {
        setSelectedTags(prev =>
        prev.includes(tag)
            ? prev.filter(t => t !== tag)
            : [...prev, tag]
        );
    };

    const handleSearch = () => {
        filterActiveContent(searchTerm, { tags: selectedTags, radius});
        handleFilterClose();
    };

    return (
        <div className="search-bar-container">
            <IconButton className="filter-button" onClick={handleFilterClick}>
                <FilterListIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleFilterClose}>
                <Box px={2} py={1} width={250}>
                    <Typography variant="subtitle1">Tags</Typography>
                    <FormGroup>
                        {tagOptions.map(tag => (
                        <FormControlLabel
                            key={tag}
                            control={
                            <Checkbox
                                checked={selectedTags.includes(tag)}
                                onChange={() => toggleTag(tag)}
                            />
                            }
                            label={tag}
                        />
                        ))}
                    </FormGroup>

                    <Typography variant="subtitle1" sx={{ mt: 2 }}>Radius ({radius} km)</Typography>
                    <Slider
                        value={radius}
                        onChange={(_, val) => setRadius(val)}
                        min={0}
                        max={100}
                        valueLabelDisplay="auto"
                    />
                    <button
                        onClick={handleSearch}
                        className="apply-button"
                    >
                        Apply Filters
                    </button>
                </Box>
            </Menu>
            <div className="search-bar">
                <input 
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value)
                    }}
                    onKeyDown={(e => {
                        if (e.key === "Enter") {
                            handleSearch();
                        }
                    })}
                />
            </div>
            <div className="search-bar-buttons">
                <div className="search-button" onClick={() => resetFilter()}>
                    Reset
                </div>
                <div className="search-button" onClick={() => handleSearch()}>
                    Search
                </div>
            </div>
        </div>
    );
}
export default SearchBar;