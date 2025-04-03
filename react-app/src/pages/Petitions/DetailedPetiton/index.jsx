import React from "react";

const DetailedPetition = ({petitionDetails}) => {
return (
    <div>
        <button onClick={() => window.history.back()}>Back</button>
        {/* Display detailed information about the petition */}
        <h1>{petitionDetails.title}</h1>
        <h2>{petitionDetails.detailedDescription}</h2>
        {/* Add your detailed petition content here */}
    </div>
);
}
export default DetailedPetition;