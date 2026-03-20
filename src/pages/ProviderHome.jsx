import { useApp } from "../context/AppContext";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Stars from "../components/Stars";
import Button from "../components/Button";
import AppIcon from "../components/AppIcon";

const ProviderHome = () => {
  const { currentUser, orders, setScreen, updateUser, showToast } = useApp();
  const myJobs = orders.filter(o => o.providerId === currentUser?.id);
  const stats = {
    pending: myJobs.filter(o => o.status === "menunggu").length,
    active: myJobs.filter(o => o.status === "berlangsung").length,
    done: myJobs.filter(o => o.status === "selesai").length,
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

        <Card className="mb-4">
          <h3 className="font-bold mb-3">Keahlian Saya</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {currentUser?.skills?.map(s => <Badge key={s} color="#0284C7">{s}</Badge>) || <span className="text-gray-400 text-sm">Belum ada keahlian</span>}
          </div>
          <Button size="sm" variant="outline" onClick={() => setScreen("profile")}>Kelola Keahlian</Button>
        </Card>

        {stats.pending > 0 && (
          <Card className="border-2 border-sky-600 bg-sky-50 cursor-pointer" onClick={() => setScreen("jobs")}>
            <div className="flex items-center gap-3">
              <div className="text-sky-600"><AppIcon name="bell" size={26} /></div>
              <div>
                <div className="font-bold text-sky-600">Ada {stats.pending} permintaan baru!</div>
                <div className="text-sm text-gray-400">Tap untuk melihat dan merespons</div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProviderHome;
