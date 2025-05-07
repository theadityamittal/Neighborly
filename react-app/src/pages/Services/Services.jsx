import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useSelector } from "react-redux";
import "./Services.css";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/SearchBar";
import AddIcon from '@mui/icons-material/Add';
import { SERVICE_TAGS } from "../../assets/tags";
import ServiceCards from "./ServiceCards";

const haversine = require('haversine-distance')

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { access } = useSelector((state) => state.auth);
  const { latitude, longitude } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/services/", {
        headers: {
          Authorization: `Bearer ${access}`
        }
      });
      setServices(res.data);
      console.log("Fetched services:", res.data);

    } catch (err) {
      console.error("Failed to fetch services:", err);
      setError("Could not load services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [access]);

  

  const filterServices = (searchTerm, {tags, radius}) => {
    const filteredServices = services.filter((service) => {
      const titleMatch = service.title.toLowerCase().includes(searchTerm.toLowerCase());
      const tagsMatch = tags.length === 0 || service?.tags.some(tag => tags.includes(tag));

      const serviceLocation = {
        latitude: service.latitude,
        longitude: service.longitude
      };

      const userLocation = {
        latitude: latitude,
        longitude: longitude
      };
      
      const distance = haversine(serviceLocation, userLocation) / 1000;

      const withinRadius = radius === 0 || distance <= radius;

      return titleMatch && tagsMatch && withinRadius;
    })

    setServices(filteredServices);
  }

  const resetServices = () => {
    setSearchTerm("");
    fetchServices();
  }

  if (loading) return <p>Loading services...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <div className="service-header">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} filterActiveContent={filterServices} resetFilter={resetServices} tagOptions={SERVICE_TAGS}/>
        <div className="service-header-btn" onClick={() => navigate("/create-service")}>
          <AddIcon fontSize="large"/>
        </div>
      </div>
      <ServiceCards services={services}/>
    </div>
  );
};

export default Services;