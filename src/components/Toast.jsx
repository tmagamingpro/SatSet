import { useEffect } from "react";
import AppIcon from "./AppIcon";

const COLORS = { success: "#22C55E", error: "#EF4444", info: "#3B82F6", warning: "#F59E0B" };
const ICONS = { success: "badgeCheck", error: "x", info: "message", warning: "clock" };

const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className="fixed bottom-6 right-6 z-[2000] bg-[#0B1F3A]/95 backdrop-blur-md text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 min-w-[260px] border border-white/10"
      style={{ borderLeft: `4px solid ${COLORS[type]}` }}
    >
      <AppIcon name={ICONS[type]} size={16} className="shrink-0" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

export default Toast;
