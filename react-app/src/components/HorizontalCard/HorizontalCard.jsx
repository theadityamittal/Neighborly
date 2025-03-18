import './HorizontalCard.css'
import Button from '../Button/Button';

function HorizontalCard({ id, title, provider, location, closestAvailability = "", image, tabs, viewType }) {

    const handleClick = () => {
        console.log(`You clicked on ${id}`);
    }

  return (
    <div className="horizontal-card">
      <img className="horizontal-card-image" src={image} alt={title} />
      <div className="horizontal-card-content">
        <div className='horizontal-card-tabs'>{ tabs && tabs.map((item) => <div className="horizontal-card-tab">{item}</div> )}</div>
        <div className="horizontal-card-title">{title}</div>
        <div className="horizontal-card-provider">{provider}</div>
        <div>{location}</div>
        { closestAvailability && 
          <div><span style={{fontWeight: 600}}>Closest Availability:</span> {closestAvailability}</div>
        }
        <div className='button-container'><Button onClick={handleClick} text={'View'}/></div>

      </div>
    </div>
  );
}

export default HorizontalCard;