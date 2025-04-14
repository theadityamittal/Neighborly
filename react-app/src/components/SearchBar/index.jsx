import React from "react";
import "./SearchBar.css";

const SearchBar = ({ searchTerm, setSearchTerm, filterActiveContent }) => {
  return (
    <div className="search-bar-container">
        <div className="search-bar">
            <input 
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value)
                }}
            />
        </div>
        <div className="search-bar-buttons">
            <div className="search-button" onClick={() => setSearchTerm("")}>
                Clear
            </div>
            <div className="search-button" onClick={() => filterActiveContent(searchTerm)}>
                Search
            </div>
        </div>
    </div>
  );
}
export default SearchBar;