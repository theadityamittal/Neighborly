import './VerticalCard.css'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

function VerticalCard({ id, title, provider, location, closestAvailability, tabs, image, viewType, numberSigned, handleClick }) {

  return (
    <div className="vertical-card">
      <div onClick={handleClick} className="vertical-card-button">
        <ArrowForwardRoundedIcon style={{ color: 'white', fontSize: '40px' }} />
      </div>
      <div className="vertical-card-content">
        <img className="vertical-card-image" src={image} alt={title} />
        <div className="vertical-card-text">
          <div className='vertical-card-tabs'>
            {tabs && tabs.map((item, index) => (
              <div key={`${item}-${index}`} className="vertical-card-tab">
                {item}
              </div>
            ))}
          </div>
          <div className="vertical-card-title">{title}</div>
          <div className="vertical-card-provider">{provider}</div>
          <div className='vertical-card-description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec feugiat egestas posuere</div>
        </div>
      </div>
      <div className='vertical-card-footer'>
        <div className='vertical-card-signed'>{numberSigned} people signed</div>
      </div>
    </div>
  );
}

export default VerticalCard;