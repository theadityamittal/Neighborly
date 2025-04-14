import React, { use, useEffect, useMemo, useState } from "react";
import { Dashboard as DashboardIcon, Build, Event as EventIcon, HowToVote, MiscellaneousServices } from "@mui/icons-material";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import { useNavigate } from "react-router";
import Bulletin from "../../pages/Bulletin/Bulletin";
import Tools from "../../pages/Tools/Tools";
import Services from "../../pages/Services/Services";
import Events from "../../pages/Events/Events";
import Petitions from "../../pages/Petitions/Petitions";
import DetailedPetition from "../../pages/Petitions/DetailedPetition";
import SearchBar from "../SearchBar";
import UserProfile from "../../pages/UserProfile/UserProfile";
import { getUserInformation } from "../../services/authService";
import { useDispatch, useSelector } from "react-redux";
import { storeUserInformation } from "../../redux/authSlice";

const Dashboard = ({currentRoute, setCurrentRoute, handleItemClick}) => {
    const [activeItem, setActiveItem] = useState(null);
    const [petitionDetails, setPetitionDetails] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.access);

    const menuItems = useMemo(() => [
        { name: "Bulletin", icon: <DashboardIcon />, path: "/bulletin", content: <Bulletin /> },
        { name: "Tools", icon: <Build />, path: "/tools" , content: <Tools />},
        { name: "Services", icon: <MiscellaneousServices />, path: "/services", content: <Services /> },
        { name: "Events", icon: <EventIcon />, path: "/events" , content: <Events />},
        { name: "Petitions", icon: <HowToVote />, path: "/petitions", content: <Petitions setPetitionDetails={setPetitionDetails}/> }
    ], []);

    const headerItems = useMemo(() => [
    { name: "Home", path: "/", content: <Bulletin /> },
    { name: "Messages", path: "/messages", content: <Bulletin />  },
    { name: "Notifications", path: "/notifications", content: <Bulletin />  },
    { name: "Profile", path: "/profile", content: <UserProfile />  }
    ], []);
    

    const individualItems = useMemo(() => [
        { 
            name: "Petition", 
            pathPattern: "/petition/", 
            path: "/petition/:id", 
            // Don't directly render the component here with props
            content: "petition-detail" // Just use a marker instead
        }
    ], []);

    // Grab User Information on Load
    useEffect(() => {
        const UserInformation = async () => {
            try {
                const response = await getUserInformation(token);
                console.log(response.data);
                dispatch(storeUserInformation(response.data));
            } catch (e) {
                console.error("Error fetching user information:", e);
            }
        }
        UserInformation();
    }, []);

    // Update the current route when URL changes
    useEffect(() => {
        // Extract just the pathname from URL
        const path = window.location.pathname;
        setCurrentRoute(path);
    }, [setCurrentRoute]);
    
    // Update activeItem based on currentRoute
    useEffect(() => {
        // Check standard menu items first
        const menuItem = menuItems.find((item) => item.path === currentRoute);
        const headerItem = headerItems.find((item) => item.path === currentRoute);
        
        // Special handling for pattern matching (like "/petition/123")
        const individualItem = individualItems.find((item) => 
            currentRoute.startsWith(item.pathPattern)
        );
        
        const currentItem = menuItem || headerItem || individualItem;
        
        if (currentItem) {
            setActiveItem(currentItem);
        } else {
            setActiveItem(menuItems[0]); // Default to the first item if no match
        }
    }, [currentRoute, menuItems, headerItems, individualItems]);

    // Handle search functionality
    const filterActiveContent = (searchTerm) => {
        console.log("Filtering content with search term:", searchTerm);
        console.log("Active item before filtering:", activeItem);
    }

    // Render the active content based on currentRoute
    const renderActiveContent = () => {
        // Special case for petition detail pages
        if (currentRoute.startsWith('/petition/')) {
            if (!petitionDetails) {
                // If we don't have the details, fetch them or redirect
                // For now, let's just go to the petitions page
                navigate('/petitions');
                return null;
            }
            // Pass petitionDetails as a prop, not as a child
            return <DetailedPetition petitionDetails={petitionDetails} />;
        }
        
        if (activeItem && activeItem.content) {
            // Special case for the content marker we set above
            if (activeItem.content === "petition-detail") {
                return <DetailedPetition petitionDetails={petitionDetails} />;
            }
            return activeItem.content;
        }
        return null;
    };

    return (
        <div className="main-content" style={{ flex: 1, padding: "20px" }}>
            <Header handleItemClick={handleItemClick}/>
            <div style={{ display: "flex" }}>
                <Sidebar
                    menuItems={menuItems}
                    activeItem={
                        // Mark Petitions as active when viewing a petition detail
                        currentRoute.startsWith('/petition/') 
                            ? "Petitions" 
                            : activeItem?.name
                    }
                    handleItemClick={(item, path) => {
                        setActiveItem(item);
                        navigate(path);
                    }}
                />
                <div className="page-content" style={{ flex: 1, marginLeft: "20px" }}>
                    {/* Render SearchBar if activeItem is part of menuItems */}
                    { activeItem && menuItems.some(item => item.name === activeItem.name) && (
                        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} filterActiveContent={filterActiveContent}/>
                    )}
                    {renderActiveContent()}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;