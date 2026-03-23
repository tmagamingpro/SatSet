import { useApp } from "../context/AppContext";

const TopBar = ({ title, subtitle, back, actions }) => {
  const { setScreen } = useApp();
  return (
    <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-5 py-3.5 flex items-center justify-between shadow-[0_6px_18px_rgba(15,23,42,0.06)]">
      <div className="flex items-center gap-3">
        {back && (
          <button
            onClick={() => setScreen(back)}
            className="bg-transparent border-none cursor-pointer text-xl text-slate-400 hover:text-slate-700"
          >
            ←
          </button>
        )}
        <div>
          <h2 className="text-lg font-bold leading-tight">{title}</h2>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
};

export default TopBar;
