const Card = ({ children, className = "", onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-[0_10px_24px_rgba(15,23,42,0.08)] border border-slate-200/70
      ${onClick ? "cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(15,23,42,0.12)]" : ""}
      ${className}`}
  >
    {children}
  </div>
);

export default Card;
