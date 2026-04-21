import Card from "../../../../components/Card";
import Badge from "../../../../components/Badge";
import Button from "../../../../components/Button";
import AppIcon from "../../../../components/AppIcon";
import { ProgressRing } from "../../../../components/Charts";
import { formatRupiah } from "../../../../utils/format";

const DashboardTab = ({
  income,
  stats,
  myJobsCount,
  myMetrics,
  currentUser,
  recentRequests,
  onGoToScreen,
}) => (
  <>
    <Card className="mb-4 p-4 bg-gradient-to-r from-sky-600 to-cyan-500 text-white border-none">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-white/80">Performa Bulan Ini</p>
          <h3 className="font-bold text-base mt-0.5">{formatRupiah(income.month)}</h3>
          <p className="text-[11px] text-white/80 mt-1">Total pemasukan dari pekerjaan selesai</p>
        </div>
        <button
          type="button"
          onClick={() => onGoToScreen("orders")}
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
      ].map((s) => (
        <Card
          key={s.label}
          className="text-center py-4 px-2 cursor-pointer hover:shadow-md transition-all"
          onClick={() => onGoToScreen("jobs")}
        >
          <div className="mb-1 flex justify-center text-slate-500">
            <AppIcon name={s.icon} size={20} />
          </div>
          <div className="font-extrabold text-xl" style={{ color: s.color }}>
            {s.value}
          </div>
          <div className="text-[11px] text-gray-400">{s.label}</div>
        </Card>
      ))}
    </div>

    <div className="grid grid-cols-2 gap-3 mb-6">
      <Card className="p-3.5 bg-gradient-to-r from-emerald-50 to-cyan-50">
        <p className="text-[11px] text-gray-500">Pemasukan Total</p>
        <p className="text-sm font-bold text-slate-800 mt-1">{formatRupiah(income.total)}</p>
        <p className="text-[10px] text-gray-400 mt-1">{stats.done} pekerjaan selesai</p>
      </Card>
      <Card className="p-3.5 bg-gradient-to-r from-sky-50 to-cyan-50">
        <p className="text-[11px] text-gray-500">Rata-rata per Pekerjaan</p>
        <p className="text-sm font-bold text-slate-800 mt-1">{formatRupiah(income.avgPerJob)}</p>
        <p className="text-[10px] text-gray-400 mt-1">{myJobsCount} total pekerjaan</p>
      </Card>
    </div>

    <Card className="mb-6 p-4">
      <h3 className="font-bold mb-4">KPI Performa</h3>
      <div className="flex justify-around gap-4">
        <ProgressRing
          value={myMetrics.activeRate || 0}
          label="Order Aktif"
          color="#3B82F6"
          size={100}
        />
        <ProgressRing value={myMetrics.acceptanceRate || 0} label="Acceptance Rate" color="#0EA5E9" size={100} />
        <ProgressRing value={myMetrics.completionRate || 0} label="Completion Rate" color="#22C55E" size={100} />
      </div>
    </Card>

    <h3 className="font-bold text-base mb-3.5">Aksi Cepat</h3>
    <div className="grid grid-cols-3 gap-2.5 mb-6">
      {[
        { label: "Pekerjaan", icon: "briefcase", to: "jobs", color: "#0284C7" },
        { label: "Riwayat", icon: "clipboard", to: "orders", color: "#0D9488" },
        { label: "Profil", icon: "user", to: "profile", color: "#0369A1" },
      ].map((action) => (
        <button
          key={action.label}
          onClick={() => onGoToScreen(action.to)}
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
        {currentUser?.skills?.map((s) => (
          <Badge key={s} color="#0284C7">
            {s}
          </Badge>
        )) || <span className="text-gray-400 text-sm">Belum ada keahlian</span>}
      </div>
      <Button size="sm" variant="outline" onClick={() => onGoToScreen("profile")}>
        Kelola Keahlian
      </Button>
    </Card>

    <Card className="mb-4 p-4 bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-100">
      <p className="text-xs font-semibold text-emerald-700">Tips SatSet</p>
      <p className="text-sm font-semibold text-slate-800 mt-1">Balas chat lebih cepat & lengkapi profil untuk tingkatkan peluang order.</p>
    </Card>

    {stats.pending > 0 && (
      <Card className="mb-4 border-2 border-sky-600 bg-sky-50 cursor-pointer" onClick={() => onGoToScreen("jobs")}>
        <div className="flex items-center gap-3">
          <div className="text-sky-600">
            <AppIcon name="bell" size={26} />
          </div>
          <div>
            <div className="font-bold text-sky-600">Ada {stats.pending} permintaan baru!</div>
            <div className="text-sm text-gray-400">Tap untuk melihat dan merespons</div>
          </div>
        </div>
      </Card>
    )}

    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-base">Permintaan Terbaru</h3>
        <button
          type="button"
          onClick={() => onGoToScreen("jobs")}
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
            <Card
              key={order.id}
              className="p-3.5 cursor-pointer hover:shadow-md transition-all"
              onClick={() => onGoToScreen("jobs")}
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{order.service}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{order.location}</p>
                </div>
                <span
                  className="text-[11px] font-bold px-2 py-1 rounded-full"
                  style={{
                    background:
                      order.status === "selesai" ? "#DCFCE7" : order.status === "berlangsung" ? "#DBEAFE" : "#FEF3C7",
                    color:
                      order.status === "selesai" ? "#166534" : order.status === "berlangsung" ? "#1D4ED8" : "#92400E",
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
  </>
);

export default DashboardTab;
