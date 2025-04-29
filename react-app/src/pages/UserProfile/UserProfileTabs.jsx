import { use, useEffect, useState } from "react";
import Bulletin from "../Bulletin/Bulletin";
import Events from "../Events/Events";
import PetitionCards from "../Petitions/PetitionCards";
import Services from "../Services/Services";
import Tools from "../Tools/Tools";
import axiosInstance from "../../utils/axiosInstance";
import { useSelector } from "react-redux";

import "./UserProfile.css"; // Import your CSS file

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
            // fetchUserPosts();
        }
        else if (selectedTab === "listedTools") {
            // fetchUserTools();
        } else if (selectedTab === "requestedServices") {
            // fetchUserServices();
        } else if (selectedTab === "hostedEvents") {
            // fetchUserEvents();
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
        { label: "My Posts", value: "myPosts", content: <Bulletin /> },
        { label: "Listed Tools", value: "listedTools", content: <Tools /> },
        { label: "Requested Services", value: "requestedServices" , content: <Services />},
        { label: "Hosted Events", value: "hostedEvents", content: <Events /> },
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