import './VerticalCard.css'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

function VerticalCard({ title, description, provider, tabs, image, numberSigned, handleClick, NoButton = false, isNGO = false }) {

  return (
    <div className={`vertical-card ${isNGO ? 'ngo-card' : ''}`}>
      { NoButton ? <></> :
        <div onClick={handleClick} className="vertical-card-button">
          <ArrowForwardRoundedIcon style={{ color: 'white', fontSize: '40px' }} />
        </div>
      }
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
          <div className='vertical-card-description'>{description}</div>
        </div>
      </div>
      <div className='vertical-card-footer'>
        {numberSigned !== "" ? 
        <div className='vertical-card-signed'>{numberSigned} people signed</div>
        :
        <></> 
        }
      </div>
    </div>
  );
}

export default VerticalCard;