import { useApp } from "../../context/AppContext";
import Card from "../../components/Card";
import StatCard from "../../components/StatCard";
import Badge from "../../components/Badge";
import AppIcon from "../../components/AppIcon";
import { formatDate } from "../../utils/format";

const AdminDashboard = () => {
  const { users, orders } = useApp();
  const stats = {
    pencari: users.filter(u => u.role === "pencari").length,
    penyedia: users.filter(u => u.role === "penyedia").length,
    verified: users.filter(u => u.role === "penyedia" && u.isVerified).length,
    orders: orders.length,
    done: orders.filter(o => o.status === "selesai").length,
    active: orders.filter(o => o.status === "berlangsung").length,
    pending: orders.filter(o => o.status === "menunggu").length,
    revenue: orders.filter(o => o.status === "selesai").reduce((sum, o) => sum + (o.price || 0), 0),
  };

  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  const statusColors = { menunggu: "#F59E0B", berlangsung: "#3B82F6", selesai: "#22C55E", dibatalkan: "#EF4444", ditolak: "#9CA3AF" };
  const topProviders = users.filter(u => u.role === "penyedia" && u.isVerified).sort((a, b) => b.rating - a.rating).slice(0, 3);

  return (
    <div className="pb-20">
      <div className="bg-gradient-to-br from-[#0B1F3A] via-[#123A63] to-[#0E7490] px-5 pt-7 pb-10">
        <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Admin Panel</p>
        <h1 className="text-2xl font-extrabold text-white mt-0.5">Dashboard SatSet</h1>
        <p className="text-white/50 text-xs mt-1">{formatDate(new Date())}</p>
      </div>

      <div className="px-5 -mt-5 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={<AppIcon name="search" size={22} />} value={stats.pencari} label="Pencari Jasa" color="#3B82F6" />
          <StatCard icon={<AppIcon name="hardHat" size={22} />} value={stats.penyedia} label="Penyedia Jasa" color="#22C55E" />
          <StatCard icon={<AppIcon name="badgeCheck" size={22} />} value={stats.verified} label="Terverifikasi" color="#FFC107" />
          <StatCard icon={<AppIcon name="clipboard" size={22} />} value={stats.orders} label="Total Pesanan" color="#0284C7" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <div className="mb-1 text-slate-500"><AppIcon name="wallet" size={20} /></div>
            <div className="font-bold text-base text-sky-600">
              Rp {(stats.revenue / 1000).toFixed(0)}K
            </div>
            <div className="text-xs text-gray-400">Pendapatan Platform</div>
          </Card>
          <Card className="p-4">
            <div className="mb-1 text-slate-500"><AppIcon name="zap" size={20} /></div>
            <div className="font-bold text-base text-blue-500">{stats.active}</div>
            <div className="text-xs text-gray-400">Pesanan Aktif</div>
          </Card>
        </div>

        <Card>
          <h3 className="font-bold mb-3">Ringkasan Sistem</h3>
          <div className="flex flex-col gap-0">
            {[
              { label: "Total Pengguna", value: users.length - 1 },
              { label: "Pesanan Selesai", value: stats.done },
              { label: "Pesanan Menunggu", value: stats.pending },
              { label: "Perlu Verifikasi", value: stats.penyedia - stats.verified },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-400">{label}</span>
                <span className="font-bold text-base">{value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-bold mb-3">Pesanan Terbaru</h3>
          <div className="flex flex-col gap-2">
            {recentOrders.map(order => {
              const customer = users.find(u => u.id === order.customerId);
              const provider = users.find(u => u.id === order.providerId);
              return (
                <div key={order.id} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                  <div className="flex-1 min-w-0 mr-2">
                    <div className="text-sm font-semibold truncate">{order.service}</div>
                    <div className="text-[11px] text-gray-400">{customer?.name} {"->"} {provider?.name}</div>
                  </div>
                  <Badge color={statusColors[order.status]}>{order.status}</Badge>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <h3 className="font-bold mb-3">Penyedia Terbaik</h3>
          <div className="flex flex-col gap-2.5">
            {topProviders.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold">{p.name}</div>
                  <div className="text-[11px] text-gray-400">{p.skills?.slice(0, 2).join(", ")}</div>
                </div>
                <div className="text-xs font-bold text-yellow-500 inline-flex items-center gap-1"><AppIcon name="star" size={12} /> {p.rating}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
