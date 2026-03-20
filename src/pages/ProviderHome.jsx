import { useApp } from "../context/AppContext";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Stars from "../components/Stars";
import Button from "../components/Button";
import AppIcon from "../components/AppIcon";
import { formatRupiah } from "../utils/format";

const ProviderHome = () => {
  const { currentUser, orders, setScreen, updateUser, showToast } = useApp();
  const myJobs = orders.filter(o => o.providerId === currentUser?.id);
  const recentRequests = [...myJobs]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  const stats = {
    pending: myJobs.filter(o => o.status === "menunggu").length,
    active: myJobs.filter(o => o.status === "berlangsung").length,
    done: myJobs.filter(o => o.status === "selesai").length,
  };
  const income = {
    total: myJobs.filter(o => o.status === "selesai").reduce((sum, order) => sum + (order.price || 0), 0),
    month: myJobs
      .filter((o) => o.status === "selesai" && new Date(o.createdAt).getMonth() === new Date().getMonth())
      .reduce((sum, order) => sum + (order.price || 0), 0),
  };
  const isActiveNow = currentUser?.isActive !== false;

  return (
    <div className="pb-20">
      <div className="bg-gradient-to-br from-[#0B1F3A] via-[#123A63] to-[#0E7490] px-5 pt-7 pb-10">
        <p className="text-white/60 text-sm">Selamat datang kembali</p>
        <h1 className="text-2xl font-extrabold text-white">{currentUser?.name}</h1>
        <div className="mt-2 flex items-center gap-2">
          {currentUser?.isVerified
            ? <Badge color="#22C55E"><span className="inline-flex items-center gap-1"><AppIcon name="badgeCheck" size={13} /> Akun Terverifikasi</span></Badge>
            : <Badge color="#F59E0B"><span className="inline-flex items-center gap-1"><AppIcon name="clock" size={13} /> Menunggu Verifikasi</span></Badge>}
          {isActiveNow
            ? <Badge color="#0EA5E9"><span className="inline-flex items-center gap-1"><AppIcon name="zap" size={13} /> Aktif</span></Badge>
            : <Badge color="#64748B"><span className="inline-flex items-center gap-1"><AppIcon name="clock" size={13} /> Offline</span></Badge>}
          <Stars rating={currentUser?.rating || 0} />
        </div>
        <button
          onClick={() => {
            updateUser(currentUser.id, { isActive: !isActiveNow });
            showToast(!isActiveNow ? "Status diubah ke aktif." : "Status diubah ke offline.", "success");
          }}
          className={`mt-3 py-2 px-3.5 rounded-lg border-none text-xs font-semibold cursor-pointer
            ${isActiveNow ? "bg-slate-800 text-white" : "bg-sky-500 text-white"}`}
        >
          {isActiveNow ? "Set Offline" : "Set Aktif"}
        </button>
      </div>

      <div className="px-5 -mt-5">
        <Card className="mb-4 p-4 bg-gradient-to-r from-sky-600 to-cyan-500 text-white border-none">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-white/80">Performa Bulan Ini</p>
              <h3 className="font-bold text-base mt-0.5">{formatRupiah(income.month)}</h3>
              <p className="text-[11px] text-white/80 mt-1">Total pemasukan dari pekerjaan selesai bulan ini</p>
            </div>
            <button
              type="button"
              onClick={() => setScreen("orders")}
              className="h-9 px-3 rounded-lg bg-white text-sky-700 text-xs font-bold border-none cursor-pointer whitespace-nowrap"
            >
              Lihat Riwayat
            </button>
          </div>
        </Card>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Menunggu", value: stats.pending, color: "#F59E0B", icon: "clock" },
            { label: "Aktif", value: stats.active, color: "#3B82F6", icon: "zap" },
            { label: "Selesai", value: stats.done, color: "#22C55E", icon: "badgeCheck" },
          ].map(s => (
            <Card key={s.label} className="text-center py-4 px-2" onClick={() => setScreen("jobs")}>
              <div className="mb-1 flex justify-center text-slate-500"><AppIcon name={s.icon} size={20} /></div>
              <div className="font-extrabold text-xl" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[11px] text-gray-400">{s.label}</div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="p-3.5 bg-gradient-to-r from-emerald-50 to-cyan-50">
            <p className="text-[11px] text-gray-500">Pemasukan Total</p>
            <p className="text-sm font-bold text-slate-800 mt-1">{formatRupiah(income.total)}</p>
          </Card>
          <Card className="p-3.5 bg-gradient-to-r from-sky-50 to-cyan-50">
            <p className="text-[11px] text-gray-500">Rating Saat Ini</p>
            <p className="text-sm font-bold text-slate-800 mt-1">{Number(currentUser?.rating || 0).toFixed(1)} / 5.0</p>
          </Card>
        </div>

        <h3 className="font-bold text-base mb-3.5">Aksi Cepat</h3>
        <div className="grid grid-cols-3 gap-2.5 mb-6">
          {[
            { label: "Pekerjaan", icon: "briefcase", to: "jobs", color: "#0284C7" },
            { label: "Riwayat", icon: "clipboard", to: "orders", color: "#0D9488" },
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

        <Card className="mb-4">
          <h3 className="font-bold mb-3">Keahlian Saya</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {currentUser?.skills?.map(s => <Badge key={s} color="#0284C7">{s}</Badge>) || <span className="text-gray-400 text-sm">Belum ada keahlian</span>}
          </div>
          <Button size="sm" variant="outline" onClick={() => setScreen("profile")}>Kelola Keahlian</Button>
        </Card>

        <Card className="mb-4 p-4 bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-100">
          <p className="text-xs font-semibold text-emerald-700">Tips SatSet untuk Penyedia</p>
          <p className="text-sm font-semibold text-slate-800 mt-1">Balas chat dan permintaan lebih cepat untuk menaikkan peluang order.</p>
        </Card>

        {stats.pending > 0 && (
          <Card className="mb-4 border-2 border-sky-600 bg-sky-50 cursor-pointer" onClick={() => setScreen("jobs")}>
            <div className="flex items-center gap-3">
              <div className="text-sky-600"><AppIcon name="bell" size={26} /></div>
              <div>
                <div className="font-bold text-sky-600">Ada {stats.pending} permintaan baru!</div>
                <div className="text-sm text-gray-400">Tap untuk melihat dan merespons</div>
              </div>
            </div>
          </Card>
        )}

        <div className="mt-2">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-base">Permintaan Terbaru</h3>
            <button
              type="button"
              onClick={() => setScreen("jobs")}
              className="bg-transparent border-none text-sky-600 text-sm font-semibold cursor-pointer inline-flex items-center gap-1"
            >
              Lihat semua <AppIcon name="arrowRight" size={14} />
            </button>
          </div>

          {recentRequests.length === 0 ? (
            <Card className="p-4">
              <p className="text-sm text-gray-500">Belum ada permintaan masuk. Pastikan status kamu aktif agar mudah ditemukan.</p>
            </Card>
          ) : (
            <div className="flex flex-col gap-2.5">
              {recentRequests.map((order) => (
                <Card key={order.id} className="p-3.5" onClick={() => setScreen("jobs")}>
                  <div className="flex items-center justify-between gap-2">
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

export default ProviderHome;
