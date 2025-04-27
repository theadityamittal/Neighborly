import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance"; 
import HorizontalCard from "../../components/HorizontalCard/HorizontalCard"; 
import HorizontalCardModal from "../../components/HorizontalCard/HorizontalCardModal";
import { useSelector } from "react-redux";
import "./Services.css";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/SearchBar";
import AddIcon from '@mui/icons-material/Add';

const serviceTags = [
 "Adventure",
 "Yoga",
 "Fitness",
 "Pilates",
 "Marketing",
 "Business",
 "Photography",
 "Art",
  "Cooking",
  "Food"
];

const Services = () => {
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { access } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/services/", {
        headers: {
          Authorization: `Bearer ${access}`
        }
      });
      console.log(res.data);
      setServices(res.data);
    } catch (err) {
      console.error("Failed to fetch services:", err);
      setError("Could not load services.");
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [access]);

  const handleView = (id) => {
    setSelectedServiceId(id);
  };

  const handleClose = () => {
    setSelectedServiceId(null);
  };

  const filterServices = (searchTerm, {tags, radius}) => {
    console.log(services);
    console.log(searchTerm);
    console.log(tags);
    console.log(radius);
    

    const filteredServices = services.filter((service) => {
      const titleMatch = service.title.toLowerCase().includes(searchTerm.toLowerCase());
      const tagsMatch = tags.length === 0 || service?.tags.some(tag => tags.includes(tag));
      return titleMatch && tagsMatch;
    })

    setServices(filteredServices);
  }

  const resetServices = () => {
    setSearchTerm("");
    fetchServices();
  }

  const selectedService = services 
    ? services.find(service => service.service_id === selectedServiceId)
    : null;
  const selectedServiceWithDisable = selectedService
    ? { ...selectedService, disableBeforeToday: true }
    : null;

  if (loading) return <p>Loading services...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <div className="service-header">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} filterActiveContent={filterServices} resetFilter={resetServices} tagOptions={serviceTags}/>
        <div className="service-header-btn" onClick={() => navigate("/create-service")}>
          <AddIcon fontSize="large"/>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(2, 1fr)"
        }}
      >
        {services.map(service => (
          <HorizontalCard
            key={service.service_id}
            id={service.service_id}
            title={service.title}
            description={service.description}
            location={service.location}
            price={service.price}
            available={service.available}
            closestAvailability={service.closestAvailability}
            tags={service.tags}
            image={service.images?.[0]}
            onView={() => handleView(service.service_id)}
          />
        ))}
      </div>

      {selectedServiceWithDisable && (
        <HorizontalCardModal
          isOpen={!!selectedService}
          onClose={handleClose}
          item={selectedServiceWithDisable}
          type="service" // must match the API prefix without 's'
          api_key = "signup"
        />
      )}
    </div>
  );
};

export default Services;