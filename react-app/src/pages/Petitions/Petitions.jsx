import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import axiosInstance from "../../utils/axiosInstance"; 
import "./petitions.css";
import SearchBar from "../../components/SearchBar";
import AddIcon from '@mui/icons-material/Add';
import { PETITION_TAGS } from "../../assets/tags";
import PetitionCards from "../Petitions/PetitionCards";

const haversine = require('haversine-distance')

const Petitions = () => {
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { access } = useSelector((state) => state.auth);
  const { latitude, longitude } = useSelector((state) => state.auth);

  const fetchPetitions = async () => {
    // Fetch petitions from the API
    setLoading(true);
    try {
      const response = await axiosInstance.get("/petitions/grabPetitionData/", {
        headers: {
          Authorization: `Bearer ${access}`
        }
      });

      const data = response.data;
      console.log("Fetched petition data:", data);

      setPetitions(data.petitions);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching petition data:", err);
      setError("Failed to load petitions. Please try again later.");
      setLoading(false);
    }
  };

  const viewPetition = (id) => {
    console.log(`Card with ID ${id} clicked`);
    // Navigate to the detailed petition page
    navigate(`/petition/${id}`);
  };

  
  // Reset petitions to original state
  const resetPetitions = () => {
    fetchPetitions(); // Fetch original petitions
    setSearchTerm(""); // Reset search term
  }

  // Filter petitions based on search term and tags and radius
  const filterPetitions = (searchTerm, {tags, radius}) => {
    const filteredPetitions = petitions.filter((petition) => {
      const titleMatch = petition.title.toLowerCase().includes(searchTerm.toLowerCase());
      const tagsMatch = tags.length === 0 || petition?.tags.some(t => tags.includes(t));

      const petitionLocation = {
        latitude: petition.latitude,
        longitude: petition.longitude
      };

      const userLocation = {
        latitude: latitude,
        longitude: longitude
      };
      
      const distance = haversine(petitionLocation, userLocation) / 1000;

      const withinRadius = radius === 0 || distance <= radius;

      return titleMatch && tagsMatch && withinRadius;
    })
    setPetitions(filteredPetitions);
  }

  useEffect(() => {
    fetchPetitions(); // Fetch petitions when the component mounts
    const interval = setInterval(() => {
      fetchPetitions(); // Fetch petitions every 5 minutes
    }, 300000); // 300000 ms = 5 minutes
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  if (loading) return <div>Loading petitions...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div className="petition-header">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} filterActiveContent={filterPetitions} resetFilter={resetPetitions} tagOptions={PETITION_TAGS}/>
        {/* <div className="petition-header-btn" onClick={() => navigate("/create-petition")}>
          <AddIcon fontSize="large"/>
        </div> */}
        <button 
            className="create-button-new" 
            onClick={() => navigate("/create-petition")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            Create
          </button>
      </div>
      <PetitionCards petitions={petitions} viewPetition={viewPetition} />
    </div>
  );
};

export default Petitions;