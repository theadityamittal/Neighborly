import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useSelector } from "react-redux";
import HorizontalCardList from "./HorizontalCardList";
import PostCard from "../../components/VerticalCard/PostCard";
import PetitionCards from "../Petitions/PetitionCards";
import HorizontalCardModal from "../../components/HorizontalCard/HorizontalCardModal";
import "./UserProfile.css";
import { useNavigate } from "react-router";
import EventCards from "../Events/EventCards";
import BulletinCards from "../Bulletin/BulletinCards";
import ToolCards from "../Tools/ToolCards";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const formatTime = (time) => {
  const [h, m] = time.split(":");
  const date = new Date();
  date.setHours(h, m);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const UserProfileTabs = () => {
  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState("myPosts");
  const { access } = useSelector((state) => state.auth);
  const { user_id: userId } = useSelector((state) => state.auth);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [userPosts, setUserPosts] = useState([]);
  const [userTools, setUserTools] = useState([]);
  const [userServices, setUserServices] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [userPetitions, setUserPetitions] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleTabChange = (tab) => {
    setError(null);
    setLoading(true);
    setSelectedTab(tab);
  };

  const handleEditEvent = (event) => {
    console.log(`Card with ID ${event.event_id} clicked`);
    // Navigate to the detailed petition page
    navigate(`/event/${event.event_id}`);
  };

  const fetchUserPosts = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.get(`/bulletin/user/${userId}/`, {
        headers: { Authorization: `Bearer ${access}` },
      });
      const sorted = [...response.data].sort(
        (a, b) => new Date(b.date_posted) - new Date(a.date_posted)
      );
      console.log("Fetched posts:", response.data);
      const processed = sorted.map((post) => ({
        ...post,
        date_posted: new Date(post.date_posted).toLocaleString(),
      }));
      setUserPosts(processed);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Could not load posts from server.");
    } finally {
      setLoading(false);
    }
  };


  const fetchUserServices = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/services/user/${userId}/`, {
        headers: { Authorization: `Bearer ${access}` },
      });
      const processed = response.data.services.map((service) => ({
        ...service,
        closestAvailability: service.closestAvailability,
        image: service.images?.[0],
        tags: service.tags,
        id: service.service_id, // important for modal
      }));
      setUserServices(processed);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching services:", err);
      setError("Failed to load services.");
      setLoading(false);
    }
  };

  const fetchUserTools = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/tools/grabToolsData/owner/${userId}`, {
          headers: { Authorization: `Bearer ${access}` },
      });
      const data = response.data.tools;
      const processed = data.map((tool) => ({
        ...tool,
        provider: "You",
        closestAvailability: tool.closestAvailability || "",
      }));
      setUserTools(processed);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching user tools:", err);
      setError("Failed to load your tools.");
      setLoading(false);
    }
  };

  const fetchUserEvents = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/events/grabEventsData/organizer/${userId}`,
        {
          headers: { Authorization: `Bearer ${access}` },
        }
      );
      const data = response.data.events;
      const processed = data.map((event) => ({
        ...event,
        id: event.event_id, // important for modal
        closestAvailability: `${formatDate(event.date)} at ${formatTime(
          event.time
        )}`,
      }));
      setUserEvents(processed);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load hosted events.");
      setLoading(false);
    }
  };

  const fetchUserPetitions = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/petitions/grabPetitionData/organizer/${userId}`,
        {
          headers: { Authorization: `Bearer ${access}` },
        }
      );
      const data = response.data;
      const processed = data.petitions.map((pet) => ({
        id: pet.petition_id,
        title: pet.title,
        provider: pet.provider,
        location: pet.location,
        tags: pet.tags,
        numberSigned: pet.signature_count,
        image: pet.hero_image,
      }));
      setUserPetitions(processed);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching petition data:", err);
      setError("Failed to load petitions.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTab === "myPosts") fetchUserPosts();
    else if (selectedTab === "listedTools") fetchUserTools();
    else if (selectedTab === "createdServices") fetchUserServices();
    else if (selectedTab === "hostedEvents") fetchUserEvents();
    else if (selectedTab === "openedPetitions") fetchUserPetitions();
  }, [selectedTab]);

  const tabs = [
    {
      label: "My Posts",
      value: "myPosts",
      content: <BulletinCards posts={userPosts} />
    },
    {
      label: "Hosted Events",
      value: "hostedEvents",
      content: <EventCards eventCards={userEvents} handleCardClick={handleEditEvent}/>
    },
    {
      label: "Listed Tools",
      value: "listedTools",
      content: <ToolCards tools={userTools} />,
    },
    {
      label: "Created Services",
      value: "createdServices",
      content: (
        <HorizontalCardList
          items={userServices}
          viewRouteBase="services"
          onView={(item) => setSelectedItem(item)}
        />
      ),
    },
    {
      label: "Opened Petitions",
      value: "openedPetitions",
      content: <PetitionCards petitions={userPetitions} />,
    },
  ];

  const modalType =
    selectedTab === "listedTools"
      ? "tool"
      : selectedTab === "createdServices"
      ? "service"
      : "event";

  const apiKey =
    selectedTab === "listedTools"
      ? "borrow"
      : selectedTab === "createdServices"
      ? "signup"
      : "signup";

  return (
    <div className="user-profile-tabs">
      <div className="tabs-selector">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={`tab-btn ${selectedTab === tab.value ? "active" : ""}`}
            onClick={() => handleTabChange(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {error ? (
          <div className="error-message">{error}</div>
        ) : (
          tabs.find((tab) => tab.value === selectedTab)?.content
        )}
      </div>

      {selectedItem && (
        <HorizontalCardModal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          item={selectedItem}
          type={modalType}
          api_key={apiKey}
        />
      )}
    </div>
  );
};

export default UserProfileTabs;