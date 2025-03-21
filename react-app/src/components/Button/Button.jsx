import './Button.css';

function Button({ text, onClick }) {
  return (
    <div className="button" onClick={onClick}>
      {text}
      { text === 'View' }
    </div>
  );
}

export default Button;