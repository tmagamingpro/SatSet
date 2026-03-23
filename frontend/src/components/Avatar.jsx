import { getInitials } from "../utils/format";

const AVATAR_COLORS = ["#0EA5E9", "#2563EB", "#14B8A6", "#6366F1", "#0F766E"];

const Avatar = ({ name, size = 40, colorIndex = 0 }) => {
  const color = AVATAR_COLORS[colorIndex % AVATAR_COLORS.length];
  return (
    <div
      style={{ width: size, height: size, background: color, fontSize: size * 0.36, flexShrink: 0 }}
      className="rounded-full flex items-center justify-center text-white font-bold"
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
