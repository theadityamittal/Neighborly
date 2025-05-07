import React, { useState, useEffect } from "react";
import "./myPetitions.css";
import HorizontalCard from "../../components/HorizontalCard/HorizontalCard";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import SearchBar from "../../components/SearchBar";
import AddIcon from '@mui/icons-material/Add';
import axiosInstance from "../../utils/axiosInstance";

const haversine = require('haversine-distance');

const formatDate = (iso) =>
    new Date(iso).toLocaleDateString(undefined, {
      month: "long", day: "numeric", year: "numeric"
    });
  
  
  const formatTime = (time) => {
    const [h, m] = time.split(":");
    const date = new Date();
    date.setHours(h, m);
    return date.toLocaleTimeString([], {
      hour: "2-digit", minute: "2-digit"
    });
  };

export default function MyPetitions () {
    const [petitions, setpetitions] = useState([]);
    const { access } = useSelector((state) => state.auth);
    const { latitude, longitude } = useSelector((state) => state.auth);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
  

    const viewpetitions = (id) => {
        console.log(`Card with ID ${id} clicked`);
        // Navigate to the detailed petition page
        navigate(`/petitions/${id}`);
      };
  
    const fetchpetitions = async () => {

      try {
        const response = await axiosInstance.get(`/petitions/get_petitions_not_users/`, {
          headers: {
            Authorization: `Bearer ${access}`,
            "Content-Type": "multipart/form-data",
          }
        });

        setpetitions(response.data);
        console.log("Fetched petitions:", response.data);
      } catch (err) {
        console.error(err);
      }
    };
  
    useEffect(() => {
      fetchpetitions();
    }, []);
  
    // Filter petitions based on search term and tags and radius
    const filterpetitions = (searchTerm, {tags, radius}) => {
      const filteredpetitions = petitions.filter((petition) => {
        const titleMatch = petition.petition_name.toLowerCase().includes(searchTerm.toLowerCase());
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
      setpetitions(filteredpetitions);
    }
  
    const resetpetitions = () => {
      setSearchTerm("");
      fetchpetitions();
    }
    return (
        <div className="petitions-page">
        <div>
          <div className="petitions-header">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} filterActiveContent={filterpetitions} resetFilter={resetpetitions}/>
            <div className="petitions-header-btn" onClick={() => navigate("/create-petition")}>
              <AddIcon fontSize="large"/>
            </div>
          </div>
          <div className="petitions-list">
            {petitions.map((petition) => (
              <div key={petition.petition_id} className="petitions-item">
                <HorizontalCard
                  id={petition.petition_id}
                  title={petition.title}
                  provider={""}
                  location={
                    <span>
                      {petition.location}
                      {petition.location_link && (
                        <a
                          href={petition.location_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open in Maps"
                        >
                          📍
                        </a>
                      )}
                    </span>
                  }
                  closestAvailability={''}
                  image={petition.hero_image}
                  tabs={[...(petition.tags || []), petition.visibility]}
                  viewType="card"
                  onView={() => viewpetitions(petition.petition_id)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
}
    
