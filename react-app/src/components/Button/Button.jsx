import './Button.css';
import { FaArrowRight } from "react-icons/fa";

function Button({ text, onClick }) {
  return (
    <div className="button" onClick={onClick}>
      {text}
      { text === 'View' && <FaArrowRight style={{marginLeft: '5px'}}/> }
    </div>
  );
}

export default Button;