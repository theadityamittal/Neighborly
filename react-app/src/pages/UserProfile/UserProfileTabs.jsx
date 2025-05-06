import { use, useEffect, useState } from "react";
import Bulletin from "../Bulletin/Bulletin";
import Events from "../Events/Events";
import PetitionCards from "../Petitions/PetitionCards";
import Services from "../Services/Services";
import Tools from "../Tools/Tools";
import axiosInstance from "../../utils/axiosInstance";
import { useSelector } from "react-redux";
import HorizontalCardList from "./HorizontalCardList";
import "./UserProfile.css"; // Import your CSS file
import PostCard from "../../components/VerticalCard/PostCard";
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

    const handleTabChange = (tab) => {
        // Clear any previous error message
        setError(null);
        // Reset loading state
        setLoading(true);
        // Update the selected tab
        setSelectedTab(tab);
    };
    const fetchUserPosts = async () => {
        console.log("userId in fetchUserPosts:", userId);
        try {
          setLoading(true);
          const response = await axiosInstance.get(`/bulletin/user/${userId}/`, {
            headers: { Authorization: `Bearer ${access}` },
          });
      
          const sorted = [...response.data].sort(
            (a, b) => new Date(b.date_posted) - new Date(a.date_posted)
          );
      
          const processed = sorted.map(post => ({
            id: post.post_id,
            userName: post.user_name,
            dateTime: new Date(post.date_posted).toLocaleString(),
            postContent: post.content,
            tags: post.tags,
            image: post.image,
          }));
      
          setUserPosts(processed);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching user posts:", err);
          setError("Failed to load your posts.");
          setLoading(false);
        }
      };
    const fetchUserServices = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/services/user/${userId}/`, {
                headers: { Authorization: `Bearer ${access}` },
            });
    
            const processed = response.data.services.map(service => ({
                id: service.service_id,
                title: service.title,
                description: service.description,
                provider: service.provider,
                location: service.location,
                closestAvailability: service.closestAvailability,
                image: service.images?.[0],
                tags: service.tags,
                visibility: service.visibility,
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
      
          const processed = response.data.tools.map(tool => ({
            id: tool.tool_id,
            title: tool.title,
            provider: "You", // or blank
            location: tool.neighborhood,
            closestAvailability: tool.closestAvailability || "",
            image: tool.images?.[0],
            tags: [tool.condition, tool.visibility],
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
            const response = await axiosInstance.get(`/events/grabEventsData/organizer/${userId}`, {
                headers: {
                    Authorization: `Bearer ${access}`,
                },
            });
    
            const data = response.data.events;
            const processed = data.map(event => ({
                id: event.event_id,
                title: event.event_name,
                provider: event.organizer_name,
                location: event.location,
                closestAvailability: `${formatDate(event.date)} at ${formatTime(event.time)}`,
                image: event.image,
                tags: event.tags,
                visibility: event.visibility,
            }));
    
            setUserEvents(processed);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching events:", err);
            setError("Failed to load hosted events. Please try again later.");
            setLoading(false);
        }
    };

    const fetchUserPetitions = async () => {
        // Fetch petitions from the API
        try {
            setLoading(true);
          const response = await axiosInstance.get(`/petitions/grabPetitionData/organizer/${userId}`, {
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
            setLoading(false);
          setUserPetitions(processed);
        } catch (err) {
          console.error("Error fetching petition data:", err);
          setError("Failed to load petitions. Please try again later.");
          setLoading(false);
        }
      };

    useEffect(() => {
        // Fetch data for the default tab when the component mounts
        if (selectedTab === "myPosts") {
            fetchUserPosts();
        }
        else if (selectedTab === "listedTools") {
            fetchUserTools();
        } else if (selectedTab === "createdServices") {
            fetchUserServices();
        } else if (selectedTab === "hostedEvents") {
            fetchUserEvents();
        } else if (selectedTab === "openedPetitions") {
            fetchUserPetitions();
        }
        // setUserPosts(fetchedPosts);
        // setUserTools(fetchedTools);
        // setUserServices(fetchedServices);
        // setUserEvents(fetchedEvents);
        // setUserPetitions(fetchedPetitions);
    }, [selectedTab]);

    const tabs = [
        {
            label: "My Posts",
            value: "myPosts",
            content: (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                {userPosts.length === 0 ? (
                  <div>No posts available.</div>
                ) : (
                  userPosts.map(post => (
                    <PostCard
                      key={post.id}
                      userName={post.userName}
                      dateTime={post.dateTime}
                      postContent={post.postContent}
                      tags={post.tags}
                      image={post.image}
                    />
                  ))
                )}
              </div>
            ),
          },
        { label: "Listed Tools", value: "listedTools", content: (
            <HorizontalCardList 
              items={userTools}
              viewRouteBase="tools"
            />
        )},
        {
            label: "Created Services",
            value: "createdServices",
            content: (
              <HorizontalCardList
                items={userServices}
                viewRouteBase="services"
              />
            )
          },
          { 
            label: "Hosted Events", 
            value: "hostedEvents", 
            content: (
              <HorizontalCardList 
                items={userEvents}
                viewRouteBase="events"
              />
            ) 
        },
        { label: "Opened Petitions", value: "openedPetitions", content: <PetitionCards petitions={userPetitions}/> },
    ];

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
                ) : tabs.find((tab) => tab.value === selectedTab)?.content}
            </div>
        </div>
    );
}

export default UserProfileTabs;