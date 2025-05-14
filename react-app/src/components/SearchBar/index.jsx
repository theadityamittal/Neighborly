import React, { useState } from "react";
import {
    Box,
    IconButton,
    Menu,
    Typography,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Slider,
    Chip
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
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

    const handleReset = () => {
        setSelectedTags([]);
        setRadius(50);
        setSearchTerm('');
        resetFilter();
    };

    const removeTag = (tag) => {
        setSelectedTags(prev => prev.filter(t => t !== tag));
    };

    return (
        <div className="search-bar-container">
            <div className="search-bar-wrapper">
                <div className="search-bar">
                    <SearchIcon className="search-icon" />
                    <input 
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSearch();
                            }
                        }}
                    />
                </div>
                
                <div className="search-controls">
                    <IconButton 
                        className="filter-button" 
                        onClick={handleFilterClick}
                        color={selectedTags.length > 0 || radius !== 50 ? "primary" : "default"}
                    >
                        <FilterListIcon />
                    </IconButton>
                    
                    <button
                        onClick={handleSearch}
                        className="search-button primary"
                    >
                        Search
                    </button>
                    
                    <IconButton 
                        className="reset-button" 
                        onClick={handleReset}
                        size="small"
                    >
                        <RestartAltIcon />
                    </IconButton>
                </div>
            </div>

            {/* Active filters display */}
            {(selectedTags.length > 0 || radius !== 50) && (
                <div className="active-filters">
                    {selectedTags.map(tag => (
                        <Chip
                            key={tag}
                            label={tag}
                            onDelete={() => removeTag(tag)}
                            size="small"
                            className="filter-chip"
                        />
                    ))}
                    {radius !== 50 && (
                        <Chip
                            label={`${radius} km radius`}
                            onDelete={() => setRadius(50)}
                            size="small"
                            className="filter-chip radius-chip"
                        />
                    )}
                </div>
            )}

            <Menu 
                anchorEl={anchorEl} 
                open={open} 
                onClose={handleFilterClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                PaperProps={{
                    sx: {
                        maxHeight: '400px',
                        width: '320px'
                    }
                }}
            >
                <Box className="filter-menu">
                    <div className="filter-header">
                        <Typography variant="h6">Filters</Typography>
                        <IconButton size="small" onClick={handleFilterClose}>
                            <CloseIcon />
                        </IconButton>
                    </div>

                    <Box className="filter-content">
                        <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
                            Categories
                        </Typography>
                        <div className="tag-grid">
                            {tagOptions.map(tag => (
                                <Chip
                                    key={tag}
                                    label={tag}
                                    onClick={() => toggleTag(tag)}
                                    color={selectedTags.includes(tag) ? "primary" : "default"}
                                    variant={selectedTags.includes(tag) ? "filled" : "outlined"}
                                    size="small"
                                    className="filter-tag"
                                />
                            ))}
                        </div>

                        <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 2, mb: 1 }}>
                            Distance: {radius} km
                        </Typography>
                        <Box sx={{ px: 1 }}>
                            <Slider
                                value={radius}
                                onChange={(_, val) => setRadius(val)}
                                min={0}
                                max={100}
                                valueLabelDisplay="auto"
                                marks={[
                                    { value: 0, label: '0' },
                                    { value: 50, label: '50' },
                                    { value: 100, label: '100' }
                                ]}
                                size="small"
                            />
                        </Box>
                    </Box>
                    
                    <div className="filter-actions">
                        <button
                            onClick={() => {
                                setSelectedTags([]);
                                setRadius(50);
                            }}
                            className="filter-reset"
                        >
                            Reset Filters
                        </button>
                        <button
                            onClick={handleSearch}
                            className="apply-button"
                        >
                            Apply Filters
                        </button>
                    </div>
                </Box>
            </Menu>
        </div>
    );
}

export default SearchBar;