const styles = {
  "width": "2em",
  "height": "2em",
};
export default ({ text, fillStroke, fillStroke2 }) => {
  return (
    <svg id="text-icon" viewBox="0 0 30 30" style={styles}>
      <circle cx="15px" cy="15px" r="12px" fill={fillStroke2} stroke={fillStroke} strokeWidth="3px" />
      <circle cx="15px" cy="15px" r="9px" fill="hsl(216, 12.2%, 83.9%)" stroke={fillStroke2} strokeWidth="0.75px" />
      <text x="15px" y="20.870625px" fill={fillStroke} fontWeight="bold" fontSize="16.5px" textAnchor="middle">{text}</text>
    </svg>
  );
};

export const PowerOn = ({ stroke }) => {
  return (
    <svg id="power-on-icon" viewBox="0 0 30 30" style={styles}>
      <circle cx="15" cy="15" r="13" stroke="hsl(216, 12.2%, 83.9%)" fill="hsl(216, 12.2%, 83.9%)" />
      <path fill="none" stroke={stroke} strokeWidth="3.5px" strokeLinecap="round" shapeRendering="geometricPrecision" d="M10,6.685A 9.75 9.75 0 1 0 20 6.685M15,15V3" />
      <circle cx="15" cy="15" r="4.25" stroke={stroke} fill="rgba(0, 0, 0, 0.75)" strokeWidth="2px" />
    </svg>
  );
};

export const Arrow = ({ rotate, colors }) => {
  const _styles = {
    "width": "2.625em",
    "height": "2.625em",
  };
  const [c1, c2, c3] = colors.split("&");
  return (
    <svg id="arrow-left-icon" viewBox="0 0 30 30" style={_styles}>
      <circle cx="15px" cy="15px" r="12px" stroke={c1} fill={c1} strokeWidth="3px" />
      <path fill={c2} stroke={c3 || "maroon"} transform={`rotate(${rotate} 15 15)`} strokeLinejoin="miter" d="M7.5,15L17.5,7.5V22.5z" />
    </svg>
  );
};

export const ErrorIcon = () => {
  const _styles = {
    "width": "4.5em",
    "height": "4.5em",
  };
  return (
    <svg viewBox="0 0 30 30" style={_styles}>
      <path strokeLinejoin="round" strokeWidth="5px" stroke="maroon" fill="maroon" d="M3.5,26.5L26.5,26.5L15,3.5z" />
      <text x="15" y="22.5" textAnchor="middle" stroke="hsl(216, 12.2%, 83.9%)" fill="hsl(216, 12.2%, 83.9%)" fontSize="18">&#10069;</text>
    </svg>
  );
};