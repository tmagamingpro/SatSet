import { useApp } from "../context/AppContext";
import AppIcon from "../components/AppIcon";

const Navbar = () => {
  const { currentUser, screen, setScreen, notifications } = useApp();
  const unread = notifications.filter(n => !n.read && n.userId === currentUser?.id).length;

  const navItems =
    currentUser?.role === "pencari"
      ? [
          { id: "home", icon: "home", label: "Beranda" },
          { id: "search", icon: "search", label: "Cari" },
          { id: "orders", icon: "clipboard", label: "Pesanan" },
          { id: "chat", icon: "message", label: "Chat" },
        ]
      : currentUser?.role === "penyedia"
      ? [
          { id: "home", icon: "home", label: "Beranda" },
          { id: "jobs", icon: "briefcase", label: "Pekerjaan" },
          { id: "orders", icon: "clipboard", label: "Riwayat" },
          { id: "chat", icon: "message", label: "Chat" },
        ]
      : [
          { id: "home", icon: "home", label: "Dashboard" },
          { id: "admin-users", icon: "users", label: "Pengguna" },
          { id: "admin-orders", icon: "clipboard", label: "Pesanan" },
          { id: "admin-reports", icon: "barChart", label: "Laporan" },
        ];

  const getItemClass = active =>
    `flex-1 flex flex-col items-center gap-0.5 bg-transparent border-none cursor-pointer transition-colors duration-200 md:flex-none md:flex-row md:gap-2 md:rounded-full md:px-4 md:py-2 ${
      active ? "text-sky-600 md:bg-sky-50" : "text-gray-400 md:text-gray-500 md:hover:bg-gray-100"
    }`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 flex pt-2 pb-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] md:bottom-8 md:left-1/2 md:right-auto md:w-auto md:max-w-[calc(100vw-3rem)] md:-translate-x-1/2 md:px-2 md:py-2 md:rounded-full md:border md:border-white/60 md:bg-white/85 md:backdrop-blur-xl md:shadow-[0_18px_42px_rgba(15,23,42,0.2)]">
      {navItems.map(item => (
        <button key={item.id} onClick={() => setScreen(item.id)} className={getItemClass(screen === item.id)}>
          <span className="relative inline-flex md:text-base">
            <AppIcon name={item.icon} size={20} className="md:w-[18px] md:h-[18px]" />
            {item.id === "chat" && unread > 0 && (
              <span className="absolute -top-1 -right-1 bg-sky-600 text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center font-bold md:-top-2 md:-right-2">
                {unread}
              </span>
            )}
          </span>
          <span className={`text-[10px] md:text-xs ${screen === item.id ? "font-bold" : "font-normal"}`}>{item.label}</span>
        </button>
      ))}
      <button onClick={() => setScreen("profile")} className={getItemClass(screen === "profile")}>
        <span className="inline-flex"><AppIcon name="user" size={20} className="md:w-[18px] md:h-[18px]" /></span>
        <span className={`text-[10px] md:text-xs ${screen === "profile" ? "font-bold" : "font-normal"}`}>Profil</span>
      </button>
    </nav>
  );
};

export default Navbar;

