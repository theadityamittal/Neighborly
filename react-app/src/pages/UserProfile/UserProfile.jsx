import { Avatar, Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authSlice";
import { useNavigate } from "react-router";

import UserProfileForm from "./UserProfileForm";
import HorizontalCardModal from "../../components/HorizontalCard/HorizontalCardModal";

import { getToolsByUser } from "../../services/toolsService";
import { getRequestedServicesByUser } from "../../services/servicesService";
import VerticalCard from "../../components/VerticalCard/VerticalCard";
import "./UserProfile.css";
import { getEventsByUser } from "../../services/eventService";
import { getPetitionsByUser } from "../../services/petitionsService";
import HorizontalCard from "../../components/HorizontalCard/HorizontalCard";

import UserProfileTabs from "./UserProfileTabs";

import avatar from "../../assets/avatar.png";
import "./UserProfile.css";
import axiosInstance from "../../utils/axiosInstance";
import React, { useState, useEffect } from "react";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { name, neighborhood, user_id, access } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedTab, setSelectedTab] = useState("myPosts");
  const [tabContent, setTabContent] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    myEvents: true,
    myPosts: true,
    myPetitions: true,
    myServices: true,
    myTools: true,
  });

  const toolsWithdraw = async (signup_id, tool_id) => {
    try {
      const response = await axiosInstance.delete(`/tools/borrow/${signup_id}/`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      alert("Successfully withdrawn from the tools");

      // Reload the page to reflect changes
      setCardData(prev => ({
        ...prev,
        myTools: prev.myTools.filter(tool => tool.tool_id !== tool_id)
      }));
      
    } catch (error) {
      console.error("Error deleting borrow request:", error);
    }
  };

  const eventsWithdraw = async (signup_id, event_id) => {
    try {
      const response = await axiosInstance.delete(`/events/signups/${signup_id}/`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      alert("Successfully withdrawn from the event");

      // Reload the page to reflect changes
      setCardData(prev => ({
        ...prev,
        myEvents: prev.myEvents.filter(event => event.event_id !== event_id)
      }));
    } catch (error) {
      console.error("Error deleting borrow request:", error);
    }
  };

  const servicesWithdraw = async (signup_id, service_id) => {
    try {
      const response = await axiosInstance.delete(`/services/signup/${signup_id}/`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      alert("Successfully withdrawn from the service");

      // Reload the page to reflect changes
      setCardData(prev => ({
        ...prev,
        myServices: prev.myServices.filter(service => service.service_id !== service_id)
      }));
      
    } catch (error) {
      console.error("Error deleting borrow request:", error);
    }
  };

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
  

  const [cardData, setCardData] = useState({
    myEvents: [],
    myPetitions: [],
    myServices: [],
    myTools: [],
  });

  useEffect(() => {

    const getEvents = async () => {
      try {
        const response = await axiosInstance.get("/events/events/get_events/", {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });
        setCardData(prev => ({
          ...prev,
          myEvents: response.data
        }));
        console.log(response.data)
      } catch (error) {
        console.error("Error getting events:", error);
      }
    }

    const getTools = async () => {
      try {
        const response = await axiosInstance.get("/tools/get_tools/", {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });
        setCardData(prev => ({
          ...prev,
          myTools: response.data
        }));
        console.log(response.data)
      } catch (error) {
        console.error("Error getting tools:", error);
      }
    }

    const getServices = async () => {
      try {
        const response = await axiosInstance.get("/services/?user_services=true", {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });
        setCardData(prev => ({
          ...prev,
          myServices: response.data
        }));
        console.log(response.data)
      } catch (error) {
        console.error("Error getting services:", error);
      }
    }
    
    const getPetitions = async () => {
      try {
        const response = await axiosInstance.get("/petitions/get_my_petitions/", {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });
        setCardData(prev => ({
          ...prev,
          myPetitions: response.data
        }));
        console.log(response.data)
      } catch (error) {
        console.error("Error getting petitions:", error);
      }
    }

    getEvents();
    getTools();
    getServices();
    getPetitions();
  }, []);

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const [toolsRes, servicesRes, eventsRes, petitionsRes] = await Promise.all([
  //         getToolsByUser(user_id, access),
  //         getRequestedServicesByUser(user_id, access),
  //         getEventsByUser(user_id, access),
  //         getPetitionsByUser(user_id, access)
  //       ]);

  //       setUserCards({
  //         listedTools: toolsRes.data || [],
  //         requestedServices: servicesRes.data || [],
  //         hostedEvents: eventsRes.data || [],
  //         signedPetitions: petitionsRes.data || [],
  //         myPosts: [],
  //       });
  //     } catch (error) {
  //       console.error("Failed fetching user content:", error);
  //     }
  //   };

  //   fetchUserData();
  // }, []);

  const handleLogOut = () => {
    dispatch(logout());
    navigate("/login", { state: { message: "Logout Successful! Returning to Login page..." } });
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setModalOpen(true);
  };

  const handlePetitionClick = (petition) => {
    console.log("Clicked Petition:", petition.title);
    // You can set up a modal or redirect logic here
  };

  const handleFilterChange = (key) => {
    setFilters((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const formatLabel = (key) =>
    key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

  return (
    <>
      {isEditing ? (
        <UserProfileForm onCancel={() => setIsEditing(false)} />
      ) : (
        <>
          {/* Header */}
          <div className="bulletin-header">
            <div className="profile">
              <Avatar src={avatar} alt="User Avatar" sx={{ width: 80, height: 80 }} />
              <div>
                <Typography variant="h4" className="username">{name}</Typography>
                <Typography variant="body2" className="location">📍 {neighborhood}</Typography>
              </div>
            </div>

            <div className="profile-actions">
              <div className="left-buttons">
                <Button variant="contained" className="edit-profile-btn" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              </div>
              <div className="right-button">
                <Button variant="contained" className="logout-btn-blue" onClick={handleLogOut}>
                  Logout
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <UserProfileTabs />
          {/* Filter Panel */}
          {showFilters && (
            <div className="filters-panel">
              {Object.entries(filters).map(([key, value]) => (
                <label key={key}>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => handleFilterChange(key)}
                  />
                  {formatLabel(key)}
                </label>
              ))}
            </div>
          )}

          {/* Card Grid */}
          {filters["myEvents"] && cardData["myEvents"].length > 0 ? <h2>Events</h2> :<></>}
          {filters["myEvents"] && 
            cardData["myEvents"]?.map((event) => (
              <HorizontalCard
                id={event.event_id}
                title={event.event_name}
                provider={event.organizer_name}
                closestAvailability={`${formatDate(event.date)} at ${formatTime(event.time)}`}
                image={event.image}
                tabs={[...(event.tags || []), event.visibility]}
                viewType="card"
                changeButtonName="Unregister"
                onView={() => eventsWithdraw(event.eventsignup[0].signup_id, event.event_id)}
              />
            ))
          }
          {filters["myTools"] && cardData["myTools"].length > 0 ? <h2>Tools</h2> :<></>}
          {filters["myTools"] && 
            cardData["myTools"]?.map((tool) => (
              <HorizontalCard
                key={tool.tool_id}
                id={tool.tool_id}
                title={tool.title}
                description={tool.description}
                location={tool.neighborhood}
                price={tool.price}
                tags={[tool.condition]}      
                available={tool.available}
                image={tool.images}
                changeButtonName="Withdraw RSVP"                 
                onView={() => toolsWithdraw(tool.borrow_requests[0].signup_id, tool.tool_id)}
              />
            ))
          }
          {filters["myServices"] && cardData["myServices"].length > 0 ? <h2>Services</h2> :<></>}
          {filters["myServices"] && 
            cardData["myServices"]?.map((service) => (
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
                image={service.images}
                changeButtonName="Withdraw RSVP"
                onView={() => servicesWithdraw(service.servicesignup[0].signup_id, service.service_id)}
              />
            ))
          }
          {filters["myPetitions"] && cardData["myPetitions"].length > 0 ? <h2>Petitions</h2> :<></>}
          {filters["myPetitions"] && 
            cardData["myPetitions"]?.map((item) => (
              <div key={item.id} style={{ 
                width: 'calc(32%)',
                minWidth: '350px',
                marginBottom: '20px',
              }}>
                <VerticalCard
                  id={item.id}
                  title={item.title}
                  provider={item.provider}
                  location={item.location}
                  closestAvailability={item.closestAvailability}
                  image={item.hero_image}
                  viewType={item.viewType}
                  tags={item.tags}
                  numberSigned=""
                  NoButton={true}
                  handleClick={() => {}}
                />
              </div>
            ))
          }

          {/* Modal */}
          {modalOpen && selectedCard && (
            <HorizontalCardModal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              data={selectedCard}
            />
          )}
        </>
      )}
    </>
  );
};

export default UserProfile;
