import { useApp } from "../context/AppContext";
import Card from "../components/Card";
import Avatar from "../components/Avatar";
import AppIcon from "../components/AppIcon";
import Stars from "../components/Stars";
import { CATEGORIES } from "../utils/constants";

const Home = () => {
  const { currentUser, users, setScreen, setSelectedProvider } = useApp();
  const providers = users.filter(u => u.role === "penyedia" && u.isVerified);

  return (
    <div className="pb-20">
      <div className="bg-gradient-to-br from-[#0B1F3A] via-[#123A63] to-[#0E7490] px-5 pt-7 pb-16">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-white/60 text-sm">Halo</p>
            <h1 className="text-2xl font-extrabold text-white">{currentUser?.name?.split(" ")[0]}</h1>
          </div>
          <div className="bg-white/10 rounded-lg px-3.5 py-2 flex items-center gap-1.5">
            <AppIcon name="mapPin" size={16} className="text-white/80" />
            <span className="text-white text-sm font-medium">Palembang</span>
          </div>
        </div>
        <div
          className="mt-5 bg-white/12 rounded-2xl px-4 py-3 flex items-center gap-2.5 cursor-pointer"
          style={{ background: "rgba(255,255,255,0.12)" }}
          onClick={() => setScreen("search")}
        >
          <AppIcon name="search" size={16} className="text-white/80" />
          <span className="text-white/60 text-sm">Cari layanan apa?</span>
        </div>
      </div>

      <div className="px-5 -mt-9">
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Penyedia", value: providers.length, icon: "hardHat", color: "#0284C7" },
            { label: "Kategori", value: CATEGORIES.length, icon: "clipboard", color: "#2196F3" },
            { label: "Rating avg", value: "4.7", icon: "star", color: "#FFC107" },
          ].map(s => (
            <Card key={s.label} className="text-center py-4 px-2">
              <div className="flex justify-center mb-1 text-slate-500">
                <AppIcon name={s.icon} size={20} />
              </div>
              <div className="font-bold text-lg" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[11px] text-gray-400">{s.label}</div>
            </Card>
          ))}
        </div>

        <h3 className="font-bold text-base mb-3.5">Kategori Layanan</h3>
        <div className="grid grid-cols-4 gap-2.5 mb-7">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setScreen("search")}
              className="bg-white border border-gray-100 rounded-lg py-3 px-1.5 cursor-pointer flex flex-col items-center gap-1 transition-all hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: cat.color + "18" }}>
                <AppIcon name={cat.icon} size={18} className="text-slate-700" />
              </div>
              <span className="text-[10px] font-semibold text-gray-500 text-center">{cat.name}</span>
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center mb-3.5">
          <h3 className="font-bold text-base">Penyedia Terbaik</h3>
          <button onClick={() => setScreen("search")} className="bg-transparent border-none text-sky-600 text-sm font-semibold cursor-pointer inline-flex items-center gap-1">
            Lihat semua <AppIcon name="arrowRight" size={14} />
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {providers.sort((a, b) => b.rating - a.rating).slice(0, 3).map(p => (
            <Card key={p.id} onClick={() => { setSelectedProvider(p); setScreen("provider-detail"); }} className="p-4">
              <div className="flex gap-3 items-center">
                <Avatar name={p.name} size={48} colorIndex={p.id} />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm">{p.name}</span>
                    <AppIcon name="badgeCheck" size={16} className="text-emerald-500" />
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">{p.skills?.join(", ")}</div>
                  <div className="flex items-center gap-2.5 mt-1.5">
                    <Stars rating={p.rating} />
                    <span className="text-xs text-gray-400">{p.totalJobs} pekerjaan</span>
                  </div>
                </div>
                <AppIcon name="arrowRight" size={18} className="text-sky-600" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
