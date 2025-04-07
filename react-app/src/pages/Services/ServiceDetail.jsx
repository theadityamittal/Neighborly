import { useParams } from "react-router-dom";

const ServiceDetail = () => {
  const { id } = useParams();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Service Detail</h1>
      <p>You are viewing service with ID: {id}</p>
      {/* You can fetch and display service details here */}
    </div>
  );
};

export default ServiceDetail;
