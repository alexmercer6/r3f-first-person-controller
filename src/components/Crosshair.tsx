import '../styles/styles.css';

import crosshairImage from '../assets/crosshairs/crosshair.png'; // Adjust the path as per your project structure

export const Crosshair = () => {
  return (
    <div className="crosshair">
      <img
        height="20px"
        width="20px"
        src={crosshairImage}
        alt="Crosshair"
      />
    </div>
  );
};
