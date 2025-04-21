import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance"; 
import HorizontalCard from "../../components/HorizontalCard/HorizontalCard"; 
import HorizontalCardModal from "../../components/HorizontalCard/HorizontalCardModal";
import { useSelector } from "react-redux";
import "./Services.css";
import { useNavigate } from "react-router-dom";
//import "./Services.css";

// Iamges
import yoga1 from "../../assets/img/yoga1.jpg";
import yoga2 from "../../assets/img/yoga2.jpg";
import cooking1 from "../../assets/img/cooking1.jpg";
import cooking2 from "../../assets/img/cooking2.jpg";
import photo1 from "../../assets/img/photo1.jpg";
import marketing1 from "../../assets/img/marketing1.jpg";
import tree1 from "../../assets/img/tree1.jpg";
import pilates1 from "../../assets/img/pilates1.jpg";


const dummyServices = [
  {
    id: "1",
    title: "Premium Yoga Class",
    provider: "Zen Studio",
    location: "Los Angeles, CA",
    closestAvailability: "March 20, 2025",
    images: [
      yoga1,
      yoga2
    ],
    unavailableDates: ["2025-03-20", "2025-03-21"],
    price: "$7 / Day",
    viewType: "card",
    tabs: ["Yoga", "Fitness"]
  },
  {
    id: "2",
    title: "Gourmet Cooking Workshop",
    provider: "MasterChef Academy",
    location: "New York, NY",
    closestAvailability: "April 5, 2025",
    images: [
      cooking1,
      cooking2,
    ],
    unavailableDates: ["2025-04-05", "2025-04-06"],
    price: "$15 / Day",
    viewType: "card",
    tabs: ["Cooking", "Food"]
  },
  {
    id: "3",
    title: "Photography Bootcamp",
    provider: "Creative Lens Studio",
    location: "Chicago, IL",
    closestAvailability: "April 12, 2025",
    images: [photo1],
    unavailableDates: [],
    price: "$20 / Day",
    viewType: "card",
    tabs: ["Photography", "Art"]
  },
  {
    id: "4",
    title: "Digital Marketing Course",
    provider: "Online Academy",
    location: "San Francisco, CA",
    closestAvailability: "March 25, 2025",
    images: [marketing1],
    unavailableDates: ["2025-03-25"],
    price: "$10 / Day",
    viewType: "card",
    tabs: ["Marketing", "Business"]
  },
  {
    id: "5",
    title: "Pilates Training Session",
    provider: "Wellness Hub",
    location: "Seattle, WA",
    closestAvailability: "April 8, 2025",
    images: [pilates1],
    unavailableDates: [],
    price: "$12 / Day",
    viewType: "card",
    tabs: ["Pilates", "Fitness"]
  },
  {
    id: "6",
    title: "Tree Climbing Workshop",
    provider: "Adventure Club",
    location: "Denver, CO",
    closestAvailability: "April 15, 2025",
    images: [tree1],
    unavailableDates: ["2025-04-15"],
    price: "$18 / Day",
    viewType: "card",
    tabs: ["Adventure", "Fitness"]
  },
];

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