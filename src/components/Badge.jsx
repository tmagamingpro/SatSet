const Badge = ({ children, color = "#0284C7" }) => (
  <span
    style={{ background: color + "18", color }}
    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
  >
    {children}
  </span>
);

export default Badge;
