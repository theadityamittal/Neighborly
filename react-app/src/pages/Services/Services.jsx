import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance"; 
import HorizontalCard from "../../components/HorizontalCard/HorizontalCard"; 
import HorizontalCardModal from "../../components/HorizontalCard/HorizontalCardModal";
import { useSelector } from "react-redux";
import "./Services.css";
import { useNavigate } from "react-router-dom";

const Services = () => {
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { access } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/api/services/", {
          headers: {
            Authorization: `Bearer ${access}`
          }
        });
        setServices(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch services:", err);
        setError("Could not load services.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [access]);

  const handleView = (id) => {
    setSelectedServiceId(id);
  };

  const handleClose = () => {
    setSelectedServiceId(null);
  };

  const selectedService = services.find(
    service => service.service_id === selectedServiceId
  );
  const selectedServiceWithDisable = selectedService
    ? { ...selectedService, disableBeforeToday: true }
    : null;

  if (loading) return <p>Loading services...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Upcoming Services</h1>
      <button
        onClick={() => navigate("/create-service")}
        className="create-service-btn"
      >
        + Create New Service
      </button>
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
        />
      )}
    </div>
  );
};

export default Services;