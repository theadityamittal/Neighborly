import HorizontalCard from "../../components/HorizontalCard/HorizontalCard";
import VerticalCard from "../../components/VerticalCard/VerticalCard";
import './CardTest.css';

function CardTest () {
    const fakeData = [
        {
          id: "1",
          title: "Premium Yoga Class",
          provider: "Zen Studio",
          location: "Los Angeles, CA",
          closestAvailability: "March 20, 2025",
          image: "https://placehold.co/100x100",
          viewType: "card",
          tabs: ["Yoga", "Fitness"],
        },
        {
          id: "2",
          title: "Gourmet Cooking Workshop",
          provider: "MasterChef Academy",
          location: "New York, NY",
          closestAvailability: "April 5, 2025",
          image: "https://placehold.co/100x100",
          viewType: "card",
          tabs: ["Cooking", "Food"],
        },
        {
          id: "3",
          title: "Photography Bootcamp",
          provider: "Creative Lens Studio",
          location: "Chicago, IL",
          closestAvailability: "April 12, 2025",
          image: "https://placehold.co/100x100",
          viewType: "card",
          tabs: ["Photography", "Art"],
        },
        {
          id: "4",
          title: "Digital Marketing Course",
          provider: "Online Academy",
          location: "San Francisco, CA",
          closestAvailability: "March 25, 2025",
          image: "https://placehold.co/100x100",
          viewType: "card",
          tabs: ["Marketing", "Business"],
        },
        {
          id: "5",
          title: "Pilates Training Session",
          provider: "Wellness Hub",
          location: "Seattle, WA",
          closestAvailability: "April 8, 2025",
          image: "https://placehold.co/100x100",
          viewType: "card",
          tabs: ["Pilates", "Fitness"],
        },
        {
            id: "6",
            title: "Tree Climbing Workshop",
            provider: "Adventure Club",
            location: "Denver, CO",
            closestAvailability: "April 15, 2025",
            image: "https://placehold.co/100x100",
            viewType: "card",
            tabs: ["Adventure", "Fitness"],
          },
      ];
      const fakePetitionData = [
        {
          id: "1",
          title: "Protect Local Green Spaces",
          provider: "Eco Warriors",
          location: "Portland, OR",
          closestAvailability: "April 5, 2025",
          image: "https://placehold.co/100x100",
          viewType: "card",
          tabs: ["Environment", "Community"],
          numberSigned: 2_500,
        },
        {
          id: "2",
          title: "Increase Teacher Salaries",
          provider: "Educators United",
          location: "Chicago, IL",
          closestAvailability: "March 28, 2025",
          image: "https://placehold.co/100x100",
          viewType: "card",
          tabs: ["Education", "Policy"],
          numberSigned: 4_100,
        },
        {
          id: "3",
          title: "Ban Single-Use Plastics",
          provider: "Ocean Protection League",
          location: "San Francisco, CA",
          closestAvailability: "April 10, 2025",
          image: "https://placehold.co/100x100",
          viewType: "card",
          tabs: ["Environment", "Legislation"],
          numberSigned: 7_800,
        },
        {
          id: "4",
          title: "Lower Prescription Drug Prices",
          provider: "Healthcare for All",
          location: "New York, NY",
          closestAvailability: "March 22, 2025",
          image: "https://placehold.co/100x100",
          viewType: "card",
          tabs: ["Healthcare", "Policy"],
          numberSigned: 5_600,
        },
        {
          id: "5",
          title: "Stop Animal Testing for Cosmetics",
          provider: "Ethical Beauty Advocates",
          location: "Los Angeles, CA",
          closestAvailability: "April 15, 2025",
          image: "https://placehold.co/100x100",
          viewType: "card",
          tabs: ["Animal Rights", "Ethics"],
          numberSigned: 3_900,
        },
        {
          id: "6",
          title: "Expand Public Transportation",
          provider: "Transit for All",
          location: "Austin, TX",
          closestAvailability: "March 30, 2025",
          image: "https://placehold.co/100x100",
          viewType: "card",
          tabs: ["Infrastructure", "Sustainability"],
          numberSigned: 6_200,
        },
      ];      
      
    return (
      <div className="test-container">
        <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
        {
            fakeData.map((item) => (
                <HorizontalCard
                key={item.id}
                id={item.id}
                title={item.title}
                provider={item.provider}
                location={item.location}
                closestAvailability={item.closestAvailability}
                image={item.image}
                viewType={item.viewType}
                tabs={item.tabs}
                />
            ))
        }
        </div>
        <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>        
        {
            fakePetitionData.map((item) => (
                <VerticalCard
                key={item.id}
                id={item.id}
                title={item.title}
                provider={item.provider}
                location={item.location}
                closestAvailability={item.closestAvailability}
                image={item.image}
                viewType={item.viewType}
                tabs={item.tabs}
                numberSigned={item.numberSigned}
                />
            ))
        }
        </div>
      </div>
    )
}

export default CardTest;