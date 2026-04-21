import { useEffect, useMemo, useState } from "react";
import { useApp } from "../../context/AppContext";
import Card from "../../components/Card";
import Avatar from "../../components/Avatar";
import AppIcon from "../../components/AppIcon";
import Stars from "../../components/Stars";

const Home = () => {
  const { currentUser, users, orders, categories, notifications, markNotificationsAsRead, setScreen, setSelectedProvider } = useApp();
  const providers = users.filter((u) => u.role === "penyedia" && u.isVerified && u.isActive);
  const myRecentOrders = useMemo(
    () =>
      orders
        .filter((order) => order.customerId === currentUser?.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3),
    [orders, currentUser?.id],
  );
  const [currentTime, setCurrentTime] = useState(() =>
    new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
  );
  const topProviders = useMemo(
    () => [...providers].sort((a, b) => b.rating - a.rating).slice(0, 3),
    [providers],
  );
  const myUnreadNotifications = useMemo(
    () => notifications.filter((n) => n.userId === currentUser?.id && !n.read),
    [notifications, currentUser?.id],
  );
  const completedJobNotifications = myUnreadNotifications.filter((n) => n.type === "job_completed");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }));
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="pb-20">
      <div className="bg-gradient-to-br from-[#0B1F3A] via-[#123A63] to-[#0E7490] px-5 pt-7 pb-16">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-white/60 text-sm">Halo</p>
            <h1 className="text-2xl font-extrabold text-white">{currentUser?.name?.split(" ")[0]}</h1>
          </div>
          <div className="bg-white/10 rounded-lg px-3.5 py-2 flex items-center gap-1.5">
            <AppIcon name="clock" size={16} className="text-white/80" />
            <span className="text-white text-sm font-medium">{currentTime}</span>
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

      <div className="px-5">
        <h3 className="font-bold text-base mb-4">Kategori Layanan</h3>
        <div className="grid grid-cols-4 gap-2.5 mb-7">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setScreen("search")}
              className="bg-gradient-to-b from-white to-sky-50/40 border border-sky-100 rounded-lg py-3 px-1.5 cursor-pointer flex flex-col items-center gap-1 transition-all hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: cat.color + "18" }}>
                <AppIcon name={cat.icon} size={18} className="text-slate-700" />
              </div>
              <span className="text-[10px] font-semibold text-gray-500 text-center">{cat.name}</span>
            </button>
          ))}
        </div>
        
        <Card className="mb-6 p-4 bg-gradient-to-r from-sky-600 to-cyan-500 text-white border-none">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-white/80">Butuh bantuan cepat?</p>
              <h3 className="font-bold text-base mt-0.5">Cari pekerja aktif di sekitarmu</h3>
              <p className="text-[11px] text-white/80 mt-1">
                {providers.length} penyedia aktif siap menerima pekerjaan
              </p>
            </div>
            <button
              type="button"
              onClick={() => setScreen("search")}
              className="h-10 px-3.5 rounded-lg bg-white text-sky-700 text-sm font-bold border-none cursor-pointer whitespace-nowrap"
            >
              Mulai Cari
            </button>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-3 mb-6">
          <Card className="mb-3 p-3.5 bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <AppIcon name="zap" size={15} />
              </div>
              <div>
                <p className="text-[11px] text-gray-400">Sedang Aktif</p>
                <p className="text-sm font-bold text-slate-800">{providers.length} penyedia</p>
              </div>
            </div>
          </Card>
        </div>

        {completedJobNotifications.length > 0 && (
          <Card
            className="mb-6 border-2 border-sky-600 bg-sky-50 cursor-pointer"
            onClick={() => {
              markNotificationsAsRead(currentUser.id);
              setScreen("orders");
            }}
          >
            <div className="flex items-center gap-3">
              <div className="text-sky-600"><AppIcon name="bell" size={26} /></div>
              <div>
                <div className="font-bold text-sky-600">Ada {completedJobNotifications.length} update pekerjaan selesai!</div>
                <div className="text-sm text-gray-400">Tap untuk melihat detail pesanan</div>
              </div>
            </div>
          </Card>
        )}

        <h3 className="font-bold text-base mb-3.5">Aksi Cepat</h3>
        <div className="grid grid-cols-3 gap-2.5 mb-7">
          {[
            { label: "Cari Jasa", icon: "search", to: "search", color: "#0EA5E9" },
            { label: "Pesanan", icon: "clipboard", to: "orders", color: "#0D9488" },
            { label: "Profil", icon: "user", to: "profile", color: "#0369A1" },
          ].map((action) => (
            <button
              key={action.label}
              onClick={() => setScreen(action.to)}
              className="bg-white border border-sky-100 rounded-xl p-3 cursor-pointer text-left hover:shadow-sm transition-all"
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center mb-2"
                style={{ background: `${action.color}20`, color: action.color }}
              >
                <AppIcon name={action.icon} size={16} />
              </div>
              <p className="text-xs font-semibold text-slate-700">{action.label}</p>
            </button>
          ))}
        </div>

        <Card className="mb-3 p-4 bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-100">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-emerald-700">Tips SatSet</p>
              <h3 className="font-bold text-slate-800 mt-1">Biar dapat penyedia yang pas</h3>
              <p className="text-[11px] text-slate-500 mt-1">
                Tulis kebutuhan sedetail mungkin, tentukan radius, lalu bandingkan rating dan jumlah pekerjaan.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setScreen("search")}
              className="h-9 px-3 rounded-lg bg-emerald-500 text-white text-xs font-bold border-none cursor-pointer whitespace-nowrap"
            >
              Coba Sekarang
            </button>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-3 mb-7">
          <Card className="p-3.5">
            <p className="text-[11px] text-gray-400 mb-1">Tips #1</p>
            <p className="text-xs font-semibold text-slate-700">Pilih kategori paling spesifik agar hasil lebih akurat.</p>
          </Card>
          <Card className="p-3.5">
            <p className="text-[11px] text-gray-400 mb-1">Tips #2</p>
            <p className="text-xs font-semibold text-slate-700">Cek status aktif penyedia sebelum mengirim permintaan.</p>
          </Card>
        </div>

        <div className="flex justify-between items-center mb-3.5">
          <h3 className="font-bold text-base">Penyedia Terbaik</h3>
          <button onClick={() => setScreen("search")} className="bg-transparent border-none text-sky-600 text-sm font-semibold cursor-pointer inline-flex items-center gap-1">
            Lihat semua <AppIcon name="arrowRight" size={14} />
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {topProviders.map(p => (
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

        <div className="mt-7">
          <div className="flex justify-between items-center mb-3.5">
            <h3 className="font-bold text-base">Aktivitas Terbaru</h3>
            <button
              type="button"
              onClick={() => setScreen("orders")}
              className="bg-transparent border-none text-sky-600 text-sm font-semibold cursor-pointer inline-flex items-center gap-1"
            >
              Lihat pesanan <AppIcon name="arrowRight" size={14} />
            </button>
          </div>

          {myRecentOrders.length === 0 ? (
            <Card className="p-4">
              <p className="text-sm text-gray-500">Belum ada aktivitas pesanan. Yuk mulai cari jasa pertama kamu.</p>
            </Card>
          ) : (
            <div className="flex flex-col gap-2.5">
              {myRecentOrders.map((order) => (
                <Card key={order.id} className="p-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{order.service}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{order.location}</p>
                    </div>
                    <span
                      className="text-[11px] font-bold px-2 py-1 rounded-full"
                      style={{
                        background:
                          order.status === "selesai"
                            ? "#DCFCE7"
                            : order.status === "berlangsung"
                              ? "#DBEAFE"
                              : "#FEF3C7",
                        color:
                          order.status === "selesai"
                            ? "#166534"
                            : order.status === "berlangsung"
                              ? "#1D4ED8"
                              : "#92400E",
                      }}
                    >
                      {order.status}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
