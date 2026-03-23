import Card from "./Card";

const StatCard = ({ icon, value, label, color = "#0284C7", onClick }) => (
  <Card className="text-center p-4" onClick={onClick}>
    <div className="mb-2 flex justify-center text-slate-500">{icon}</div>
    <div className="font-bold text-2xl" style={{ color }}>{value}</div>
    <div className="text-xs text-gray-400 mt-0.5">{label}</div>
  </Card>
);

export default StatCard;
