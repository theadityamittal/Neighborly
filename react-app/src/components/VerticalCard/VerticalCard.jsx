import './VerticalCard.css'
function VerticalCard({ id, title, provider, location, closestAvailability, tabs, image, viewType, numberSigned }) {

    const handleClick = () => {
        console.log(`You clicked on ${id}`);
    }

  return (
    <div className="vertical-card">
      <img className="vertical-card-image" src={image} alt={title} />
      <div className="vertical-card-content">
        <div className='vertical-card-tabs'>{ tabs && tabs.map((item) => <div className="vertical-card-tab">{item}</div> )}</div>
        <div className="vertical-card-title">{title}</div>
        <div className="vertical-card-provider">{provider}</div>
        <div className='vertical-card-description'>Short Description</div>
        <div onClick={handleClick}>Learn More</div>
        <div className='vertical-card-signed'>{numberSigned} people signed</div>
      </div>
    </div>
  );
}

export default VerticalCard;