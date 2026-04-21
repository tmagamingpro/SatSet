import { useState } from "react";
import { useApp } from "../../context/AppContext";
import Card from "../../components/Card";
import StatCard from "../../components/StatCard";
import Badge from "../../components/Badge";
import AppIcon from "../../components/AppIcon";
import { formatDate } from "../../utils/format";
import { StatBox, DonutChart, BarChart, LineChart, ProgressRing } from "../../components/Charts";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { users, orders, reviews, categories } = useApp();
  const stats = {
    pencari: users.filter(u => u.role === "pencari").length,
    penyedia: users.filter(u => u.role === "penyedia").length,
    verified: users.filter(u => u.role === "penyedia" && u.isVerified).length,
    orders: orders.length,
    done: orders.filter(o => o.status === "selesai").length,
    active: orders.filter(o => o.status === "berlangsung").length,
    pending: orders.filter(o => o.status === "menunggu").length,
    cancelled: orders.filter(o => o.status === "dibatalkan" || o.status === "ditolak").length,
    revenue: orders.filter(o => o.status === "selesai").reduce((sum, o) => sum + (o.price || 0), 0),
    avgOrderValue: orders.length > 0 ? orders.reduce((sum, o) => sum + (o.price || 0), 0) / orders.length : 0,
  };

  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  const statusColors = { menunggu: "#F59E0B", berlangsung: "#3B82F6", selesai: "#22C55E", dibatalkan: "#EF4444", ditolak: "#9CA3AF" };
  const topProviders = users.filter(u => u.role === "penyedia" && u.isVerified).sort((a, b) => b.rating - a.rating).slice(0, 3);

  // Category performance
  const categoryStats = {};
  categories.forEach(cat => {
    const catOrders = orders.filter(o => o.service === cat.name);
    categoryStats[cat.name] = catOrders.length;
  });

  // Order status distribution
  const statusDistribution = {
    "Menunggu": stats.pending,
    "Berlangsung": stats.active,
    "Selesai": stats.done,
    "Dibatalkan": stats.cancelled,
  };

  // User distribution
  const userDistribution = {
    "Pencari": stats.pencari,
    "Penyedia": stats.penyedia,
  };

  const statusColors2 = { "Menunggu": "#F59E0B", "Berlangsung": "#3B82F6", "Selesai": "#22C55E", "Dibatalkan": "#EF4444" };
  const userColors = { "Pencari": "#3B82F6", "Penyedia": "#22C55E" };
  const getProviderMetrics = (providerId) => {
    const providerOrders = orders.filter((order) => order.providerId === providerId);
    const providerReviews = reviews.filter((review) => review.providerId === providerId);
    const total = providerOrders.length;
    const completed = providerOrders.filter((order) => order.status === "selesai").length;
    const accepted = providerOrders.filter((order) => order.status !== "ditolak").length;

    return {
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      acceptanceRate: total > 0 ? Math.round((accepted / total) * 100) : 0,
      totalReviews: providerReviews.length,
    };
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0B1F3A] via-[#123A63] to-[#0E7490] px-5 pt-7 pb-10">
        <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Admin Panel</p>
        <h1 className="text-2xl font-extrabold text-white mt-0.5">Dashboard SatSet</h1>
        <p className="text-white/50 text-xs mt-1">{formatDate(new Date())}</p>
      </div>

      <div className="px-5 -mt-5">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {[
            { id: "overview", label: "Overview", icon: "layoutGrid" },
            { id: "analytics", label: "Analytics", icon: "trendingUp" },
            { id: "users", label: "Users", icon: "users" },
            { id: "categories", label: "Categories", icon: "tag" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === tab.id
                  ? "bg-sky-600 text-white"
                  : "bg-white border border-gray-100 text-gray-700 hover:border-sky-200"
              }`}
            >
              <AppIcon name={tab.icon} size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            {/* Key Stats */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <StatCard icon={<AppIcon name="search" size={22} />} value={stats.pencari} label="Pencari Jasa" color="#3B82F6" />
              <StatCard icon={<AppIcon name="hardHat" size={22} />} value={stats.penyedia} label="Penyedia Jasa" color="#22C55E" />
              <StatCard icon={<AppIcon name="badgeCheck" size={22} />} value={stats.verified} label="Terverifikasi" color="#FFC107" />
              <StatCard icon={<AppIcon name="clipboard" size={22} />} value={stats.orders} label="Total Pesanan" color="#0284C7" />
            </div>

            {/* Revenue & Active */}
            <div className="grid grid-cols-2 gap-3 mb-6">
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

            {/* System Summary */}
            <Card className="mb-6">
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

            {/* Recent Orders */}
            <Card className="mb-6">
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

            {/* Top Providers */}
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
          </>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <>
            <h3 className="font-bold text-lg mb-4">Analytics & Insights</h3>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <StatBox
                label="Rata-rata Pesanan"
                value={`Rp ${(stats.avgOrderValue / 1000).toFixed(0)}K`}
                color="#0284C7"
                icon={<AppIcon name="wallet" size={20} />}
              />
              <StatBox
                label="Order completion rate"
                value={`${Math.round((stats.done / (stats.orders || 1)) * 100)}%`}
                color="#22C55E"
                icon={<AppIcon name="badgeCheck" size={20} />}
              />
            </div>

            {/* Order Status Distribution */}
            <Card className="mb-6 p-4">
              <h3 className="font-bold mb-4">Distribusi Status Pesanan</h3>
              <DonutChart
                data={statusDistribution}
                label="Status pesanan"
                colors={[statusColors2["Menunggu"], statusColors2["Berlangsung"], statusColors2["Selesai"], statusColors2["Dibatalkan"]]}
              />
            </Card>

            {/* User Distribution */}
            <Card className="mb-6 p-4">
              <h3 className="font-bold mb-4">Distribusi Pengguna</h3>
              <DonutChart
                data={userDistribution}
                label="Jenis pengguna"
                colors={[userColors["Pencari"], userColors["Penyedia"]]}
              />
            </Card>

            {/* Mock Revenue Trend */}
            <Card className="mb-6 p-4">
              <h3 className="font-bold mb-4">Tren Pendapatan</h3>
              <LineChart
                data={{
                  "Minggu 1": 2000000,
                  "Minggu 2": 2500000,
                  "Minggu 3": 3000000,
                  "Minggu 4": stats.revenue,
                }}
                label="Pendapatan (Rp)"
                color="#0EA5E9"
                height={150}
              />
            </Card>

            {/* System Health Metrics */}
            <Card className="display p-4">
              <h3 className="font-bold mb-4">Kesehatan Sistem</h3>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <ProgressRing value={85} label="Platform Uptime" color="#22C55E" size={100} />
                <ProgressRing value={Math.round((stats.verified / stats.penyedia) * 100) || 0} label="Provider Terverifikasi" color="#0284C7" size={100} />
                <ProgressRing value={Math.round((stats.done / stats.orders) * 100) || 0} label="Order Completion" color="#F59E0B" size={100} />
              </div>
            </Card>
          </>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <>
            <h3 className="font-bold text-lg mb-4">User Management</h3>

            {/* User Stats */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <StatBox
                label="Total Pengguna"
                value={users.length - 1}
                color="#3B82F6"
                icon={<AppIcon name="users" size={20} />}
              />
              <StatBox
                label="Penyedia Terverifikasi"
                value={stats.verified}
                color="#22C55E"
                icon={<AppIcon name="badgeCheck" size={20} />}
              />
            </div>

            {/* Top Providers by Metrics */}
            <Card className="mb-6">
              <h3 className="font-bold mb-3">Top Providers by Rating</h3>
              <div className="space-y-3">
                {topProviders.map((provider, idx) => {
                  const providerMetrics = getProviderMetrics(provider.id);
                  return (
                    <div key={provider.id} className="p-3 border border-gray-100 rounded-lg">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <p className="font-semibold text-slate-800">#{idx + 1} {provider.name}</p>
                          <p className="text-xs text-gray-500">{provider.skills?.join(", ")}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-yellow-500">{provider.rating} *</p>
                          <p className="text-xs text-gray-500">{provider.totalJobs} jobs</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-sky-50 p-1 rounded">
                          <p className="text-xs text-gray-500">Acceptance</p>
                          <p className="text-xs font-bold">{providerMetrics.acceptanceRate}%</p>
                        </div>
                        <div className="bg-emerald-50 p-1 rounded">
                          <p className="text-xs text-gray-500">Completion</p>
                          <p className="text-xs font-bold">{providerMetrics.completionRate}%</p>
                        </div>
                        <div className="bg-blue-50 p-1 rounded">
                          <p className="text-xs text-gray-500">Reviews</p>
                          <p className="text-xs font-bold">{providerMetrics.totalReviews}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Unverified Providers */}
            <Card>
              <h3 className="font-bold mb-3">Penyedia Menunggu Verifikasi</h3>
              <div className="space-y-2">
                {users
                  .filter(u => u.role === "penyedia" && !u.isVerified)
                  .map(provider => (
                    <div key={provider.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-sm font-semibold">{provider.name}</p>
                        <p className="text-xs text-gray-400">Bergabung: {new Date(provider.createdAt).toLocaleDateString()}</p>
                      </div>
                      <Badge color="#F59E0B">Pending</Badge>
                    </div>
                  ))}
              </div>
            </Card>
          </>
        )}

        {/* Categories Tab */}
        {activeTab === "categories" && (
          <>
            <h3 className="font-bold text-lg mb-4">Performa Kategori</h3>

            {/* Category Performance */}
            {Object.keys(categoryStats).length > 0 && (
              <Card className="mb-6 p-4">
                <h3 className="font-bold mb-4">Permintaan per Kategori</h3>
                <BarChart
                  data={categoryStats}
                  label="Jumlah pesanan per kategori"
                  color="#0284C7"
                  height={250}
                />
              </Card>
            )}

            {/* Category Details */}
            <Card>
              <h3 className="font-bold mb-3">Detail Kategori</h3>
              <div className="space-y-2">
                {categories.map(cat => {
                  const catOrders = orders.filter(o => o.service === cat.name);
                  const catDone = catOrders.filter(o => o.status === "selesai").length;
                  const catRevenue = catOrders.filter(o => o.status === "selesai").reduce((sum, o) => sum + (o.price || 0), 0);
                  return (
                    <div key={cat.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                        >
                          <AppIcon name={cat.icon} size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{cat.name}</p>
                          <p className="text-xs text-gray-500">{catOrders.length} pesanan</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-800">Rp {(catRevenue / 1000).toFixed(0)}K</p>
                        <p className="text-xs text-gray-500">{catDone} selesai</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
