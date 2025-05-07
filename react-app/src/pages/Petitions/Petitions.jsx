import React, { useState, useEffect } from "react";
import axios from "axios";
import VerticalCard from '../../components/VerticalCard/VerticalCard';
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import axiosInstance from "../../utils/axiosInstance"; 
import petitionsJson from "./petitionData.json"; // Import the local JSON file
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
  // Define fetchPetitions as a separate function
  const fetchPetitions = async () => {
    // ▶️ LOCAL MOCK (uncomment to use):
    // const data = petitionsJson;
    // const processed = data.map(pet => ({
    //   id: pet.petition_id,
    //   title: pet.title,
    //   provider: pet.provider,
    //   location: pet.location,
    //   tags: pet.tags,
    //   numberSigned: 0,
    //   image: pet.hero_image
    // }));
    // setPetitions(processed);
    // setLoading(false);
    // setError(null);
    // return;

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

      const processed = data.petitions.map(pet => ({
        id: pet.petition_id,
        title: pet.title,
        provider: pet.provider,       // use display name
        location: pet.location,
        tags: pet.tags,
        numberSigned: pet.signature_count,  // if you surface that in your view
        image: pet.hero_image
      }));

      setPetitions(processed);
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
        <div className="petition-header-btn" onClick={() => navigate("/create-petition")}>
          <AddIcon fontSize="large"/>
        </div>
      </div>
      <PetitionCards petitions={petitions} viewPetition={viewPetition} />
    </div>
  );
};

export default Petitions;