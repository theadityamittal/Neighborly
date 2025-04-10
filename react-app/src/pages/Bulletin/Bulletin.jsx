import React from "react";
import { useSelector } from "react-redux";
import { selectAuth } from "../../redux/authSlice";

const Bulletin = () => {
  const auth = useSelector(selectAuth); 
  console.log(auth);

  return (
    <div>
      <h1>Bulletin Page</h1>
      <p>Welcome to the Bulletin page.</p>
    </div>
  );
};
export default Bulletin;