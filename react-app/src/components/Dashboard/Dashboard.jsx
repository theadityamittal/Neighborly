import React, { useEffect, useMemo, useState } from "react";
import { Dashboard as DashboardIcon, Build, Event as EventIcon, HowToVote, MiscellaneousServices } from "@mui/icons-material";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import { useNavigate } from "react-router";
import Bulletin from "../../pages/Bulletin/Bulletin";
import Tools from "../../pages/Tools/Tools";
import Services from "../../pages/Services/Services";
import Events from "../../pages/Events/Events";
import Petitions from "../../pages/Petitions/Petitions";
import DetailedPetiton from "../../pages/Petitions/DetailedPetiton";
import UserProfie from "../../pages/UserProfile/UserProfile";

const Dashboard = ({currentRoute, setCurrentRoute, handleItemClick}) => {
    const [activeItem, setActiveItem] = useState(null);
    const [petitionDetails, setPetitionDetails] = useState(null);
    const navigate = useNavigate();

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
    { name: "Profile", path: "/profile", content: <UserProfie />  }
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
            return <DetailedPetiton petitionDetails={petitionDetails} />;
        }
        
        if (activeItem && activeItem.content) {
            // Special case for the content marker we set above
            if (activeItem.content === "petition-detail") {
                return <DetailedPetiton petitionDetails={petitionDetails} />;
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
                    {renderActiveContent()}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;