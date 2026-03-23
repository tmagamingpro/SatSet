const Stars = ({ rating = 0 }) => (
  <span className="text-sm">
    <span className="text-yellow-400">{"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))}</span>
    <span className="text-gray-400 ml-1 text-xs">{rating?.toFixed(1)}</span>
  </span>
);

export default Stars;
