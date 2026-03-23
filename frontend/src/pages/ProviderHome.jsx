import { useState } from "react";
import { useApp } from "../context/AppContext";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Stars from "../components/Stars";
import Button from "../components/Button";
import AppIcon from "../components/AppIcon";
import { formatRupiah } from "../utils/format";
import { ProgressRing, StatBox, BarChart, LineChart } from "../components/Charts";

const ProviderHome = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editScheduleMode, setEditScheduleMode] = useState(false);
  const [editedSchedule, setEditedSchedule] = useState(null);
  const { currentUser, orders, reviews, userMetrics, portfolioItems, availability, updateUser, showToast, setScreen } = useApp();
  const myJobs = orders.filter(o => o.providerId === currentUser?.id);
  const myReviews = reviews.filter(r => r.providerId === currentUser?.id);
  const myMetrics = userMetrics.find(m => m.providerId === currentUser?.id) || {};
  const myPortfolio = portfolioItems.filter(p => p.providerId === currentUser?.id);
  const myAvailability = availability.find(a => a.providerId === currentUser?.id);

  const recentRequests = [...myJobs]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const stats = {
    pending: myJobs.filter(o => o.status === "menunggu").length,
    active: myJobs.filter(o => o.status === "berlangsung").length,
    done: myJobs.filter(o => o.status === "selesai").length,
    cancelled: myJobs.filter(o => o.status === "dibatalkan" || o.status === "ditolak").length,
  };

  const income = {
    total: myJobs.filter(o => o.status === "selesai").reduce((sum, order) => sum + (order.price || 0), 0),
    month: myJobs
      .filter((o) => o.status === "selesai" && new Date(o.createdAt).getMonth() === new Date().getMonth())
      .reduce((sum, order) => sum + (order.price || 0), 0),
    avgPerJob: myJobs.length > 0 ? myJobs.reduce((sum, order) => sum + (order.price || 0), 0) / myJobs.length : 0,
  };

  const isActiveNow = currentUser?.isActive !== false;
  const avgRating = myReviews.length > 0 ? (myReviews.reduce((sum, r) => sum + r.rating, 0) / myReviews.length).toFixed(1) : currentUser?.rating || 0;

  // Service breakdown by type
  const serviceBreakdown = {};
  myJobs.forEach(job => {
    serviceBreakdown[job.service] = (serviceBreakdown[job.service] || 0) + 1;
  });

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0B1F3A] via-[#123A63] to-[#0E7490] px-5 pt-7 pb-10">
        <p className="text-white/60 text-sm">Selamat datang kembali</p>
        <h1 className="text-2xl font-extrabold text-white">{currentUser?.name?.split(" ")[0]}</h1>
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          {currentUser?.isVerified
            ? <Badge color="#22C55E"><span className="inline-flex items-center gap-1"><AppIcon name="badgeCheck" size={13} /> Terverifikasi</span></Badge>
            : <Badge color="#F59E0B"><span className="inline-flex items-center gap-1"><AppIcon name="clock" size={13} /> Menunggu Verifikasi</span></Badge>}
          {isActiveNow
            ? <Badge color="#0EA5E9"><span className="inline-flex items-center gap-1"><AppIcon name="zap" size={13} /> Aktif</span></Badge>
            : <Badge color="#64748B"><span className="inline-flex items-center gap-1"><AppIcon name="clock" size={13} /> Offline</span></Badge>}
          <Stars rating={parseFloat(avgRating) || 0} />
          <span className="text-white/80 text-xs font-semibold">{myReviews.length} review</span>
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
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {[
            { id: "dashboard", label: "Dashboard", icon: "layoutGrid" },
            { id: "analytics", label: "Analytics", icon: "trendingUp" },
            { id: "reviews", label: "Reviews", icon: "star" },
            { id: "portfolio", label: "Portfolio", icon: "image" },
            { id: "availability", label: "Jadwal", icon: "calendar" },
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

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <>
            {/* Income Card */}
            <Card className="mb-4 p-4 bg-gradient-to-r from-sky-600 to-cyan-500 text-white border-none">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-white/80">Performa Bulan Ini</p>
                  <h3 className="font-bold text-base mt-0.5">{formatRupiah(income.month)}</h3>
                  <p className="text-[11px] text-white/80 mt-1">Total pemasukan dari pekerjaan selesai</p>
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

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: "Menunggu", value: stats.pending, color: "#F59E0B", icon: "clock" },
                { label: "Aktif", value: stats.active, color: "#3B82F6", icon: "zap" },
                { label: "Selesai", value: stats.done, color: "#22C55E", icon: "badgeCheck" },
              ].map(s => (
                <Card key={s.label} className="text-center py-4 px-2 cursor-pointer hover:shadow-md transition-all" onClick={() => setScreen("jobs")}>
                  <div className="mb-1 flex justify-center text-slate-500"><AppIcon name={s.icon} size={20} /></div>
                  <div className="font-extrabold text-xl" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-[11px] text-gray-400">{s.label}</div>
                </Card>
              ))}
            </div>

            {/* Income Stats */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Card className="p-3.5 bg-gradient-to-r from-emerald-50 to-cyan-50">
                <p className="text-[11px] text-gray-500">Pemasukan Total</p>
                <p className="text-sm font-bold text-slate-800 mt-1">{formatRupiah(income.total)}</p>
                <p className="text-[10px] text-gray-400 mt-1">{stats.done} pekerjaan selesai</p>
              </Card>
              <Card className="p-3.5 bg-gradient-to-r from-sky-50 to-cyan-50">
                <p className="text-[11px] text-gray-500">Rata-rata per Pekerjaan</p>
                <p className="text-sm font-bold text-slate-800 mt-1">{formatRupiah(income.avgPerJob)}</p>
                <p className="text-[10px] text-gray-400 mt-1">{myJobs.length} total pekerjaan</p>
              </Card>
            </div>

            {/* Performance Indicators */}
            <Card className="mb-6 p-4">
              <h3 className="font-bold mb-4">KPI Performa</h3>
              <div className="flex justify-around gap-4">
                <ProgressRing value={myMetrics.responseTime ? Math.min(100, 100 - (myMetrics.responseTime * 10)) : 0} label="Response Time" color="#3B82F6" size={100} />
                <ProgressRing value={myMetrics.acceptanceRate || 0} label="Acceptance Rate" color="#0EA5E9" size={100} />
                <ProgressRing value={myMetrics.completionRate || 0} label="Completion Rate" color="#22C55E" size={100} />
              </div>
            </Card>

            {/* Quick Actions */}
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

            {/* Skills Card */}
            <Card className="mb-4">
              <h3 className="font-bold mb-3">Keahlian Saya</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {currentUser?.skills?.map(s => <Badge key={s} color="#0284C7">{s}</Badge>) || <span className="text-gray-400 text-sm">Belum ada keahlian</span>}
              </div>
              <Button size="sm" variant="outline" onClick={() => setScreen("profile")}>Kelola Keahlian</Button>
            </Card>

            {/* Tips */}
            <Card className="mb-4 p-4 bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-100">
              <p className="text-xs font-semibold text-emerald-700">💡 Tips SatSet</p>
              <p className="text-sm font-semibold text-slate-800 mt-1">Balas chat lebih cepat & lengkapi profil untuk tingkatkan peluang order.</p>
            </Card>

            {/* Pending Requests Alert */}
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

            {/* Recent Requests */}
            <div>
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
                    <Card key={order.id} className="p-3.5 cursor-pointer hover:shadow-md transition-all" onClick={() => setScreen("jobs")}>
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
          </>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <>
            <h3 className="font-bold text-lg mb-4">Analisis Performa</h3>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <StatBox
                label="Waktu Respons"
                value={`${myMetrics.responseTime || 0}h`}
                color="#3B82F6"
                icon={<AppIcon name="zap" size={20} />}
              />
              <StatBox
                label="Total Pekerjaan"
                value={myJobs.length}
                color="#0284C7"
                icon={<AppIcon name="briefcase" size={20} />}
              />
              <StatBox
                label="Tingkat Penyelesaian"
                value={`${myMetrics.completionRate || 0}%`}
                color="#22C55E"
                icon={<AppIcon name="badgeCheck" size={20} />}
              />
              <StatBox
                label="Total Review"
                value={myReviews.length}
                color="#FBBF24"
                icon={<AppIcon name="star" size={20} />}
              />
            </div>

            {/* Service Breakdown */}
            {Object.keys(serviceBreakdown).length > 0 && (
              <Card className="mb-6 p-4">
                <h3 className="font-bold mb-4">Pemecahan Layanan</h3>
                <BarChart
                  data={serviceBreakdown}
                  label="Jumlah pekerjaan per layanan"
                  color="#0284C7"
                  height={180}
                />
              </Card>
            )}

            {/* Monthly Income Trend (Mock) */}
            <Card className="mb-6 p-4">
              <h3 className="font-bold mb-4">Tren Pemasukan</h3>
              <LineChart
                data={{
                  "Jan": 1200000,
                  "Feb": 1500000,
                  "Mar": income.month,
                }}
                label="Pemasukan per bulan (Rp)"
                color="#0EA5E9"
                height={150}
              />
            </Card>

            {/* Metrics Details */}
            <Card className="p-4">
              <h3 className="font-bold mb-4">Detail Metrik</h3>
              <div className="space-y-3">
                {[
                  { label: "Response Time Rata-rata", value: `${myMetrics.responseTime || 0} jam` },
                  { label: "Acceptance Rate", value: `${myMetrics.acceptanceRate || 0}%` },
                  { label: "Completion Rate", value: `${myMetrics.completionRate || 0}%` },
                  { label: "Profil Completion", value: `${myMetrics.profileCompletion || 0}%` },
                  { label: "Total Reviews", value: myReviews.length },
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-gray-600">{item.label}</span>
                    <span className="font-bold text-gray-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <>
            <h3 className="font-bold text-lg mb-4">Ulasan Pelanggan</h3>

            {/* Rating Summary */}
            <Card className="mb-6 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-gray-500 text-sm">Rating Keseluruhan</p>
                  <p className="text-4xl font-bold text-slate-800">{avgRating}</p>
                  <Stars rating={parseFloat(avgRating)} />
                  <p className="text-xs text-gray-400 mt-1">{myReviews.length} ulasan</p>
                </div>
                <div className="flex-1">
                  {[5, 4, 3, 2, 1].map(rating => {
                    const count = myReviews.filter(r => r.rating === rating).length;
                    const percentage = myReviews.length > 0 ? (count / myReviews.length) * 100 : 0;
                    return (
                      <div key={rating} className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-500 w-4">{rating}★</span>
                        <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-yellow-400 h-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-6 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>

            {/* Recent Reviews */}
            {myReviews.length === 0 ? (
              <Card className="p-4 text-center text-gray-500">
                <p>Belum ada review dari pelanggan.</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {myReviews.slice(0, 10).map(review => (
                  <Card key={review.id} className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <Stars rating={review.rating} />
                      <p className="text-[11px] text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                    <p className="text-sm text-gray-700">{review.comment}</p>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* Portfolio Tab */}
        {activeTab === "portfolio" && (
          <>
            <h3 className="font-bold text-lg mb-4">Portfolio Saya</h3>

            {myPortfolio.length === 0 ? (
              <Card className="p-6 text-center">
                <AppIcon name="image" size={32} className="mx-auto mb-2 text-gray-400" />
                <p className="text-gray-500 mb-3">Belum ada portfolio</p>
                <Button onClick={() => setScreen("profile")}>Tambah Portfolio</Button>
              </Card>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {myPortfolio.map(item => (
                  <Card key={item.id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-all">
                    <div
                      className="w-full h-32 bg-gradient-to-br"
                      style={{
                        backgroundImage: item.image ? `url(${item.image})` : "none",
                        backgroundColor: "#f3f4f6",
                      }}
                    />
                    <div className="p-3">
                      <p className="text-sm font-semibold text-slate-800 line-clamp-2">{item.title}</p>
                      <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                      {item.beforeAfter && (
                        <Badge color="#0284C7" className="text-[10px] mt-2">Before-After</Badge>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* Availability Tab */}
        {activeTab === "availability" && (
          <>
            <h3 className="font-bold text-lg mb-4">Jadwal Ketersediaan</h3>

            {myAvailability ? (
              <>
                {/* Edit Mode Toggle */}
                {!editScheduleMode ? (
                  <>
                    {/* Weekly Schedule - View Mode */}
                    <div className="space-y-2">
                      {Object.entries(myAvailability.schedule).map(([day, times]) => (
                        <Card key={day} className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <div
                                className={`w-3 h-3 rounded-full ${times.available ? "bg-green-500" : "bg-gray-300"}`}
                              />
                              <span className="capitalize font-semibold text-sm text-gray-800" style={{ minWidth: "80px" }}>
                                {day.charAt(0).toUpperCase() + day.slice(1)}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {times.available ? `${times.startTime} - ${times.endTime}` : "Libur"}
                            </span>
                          </div>
                        </Card>
                      ))}
                    </div>

                    <Button
                      size="sm"
                      className="mt-4 w-full"
                      variant="outline"
                      onClick={() => {
                        setEditedSchedule(JSON.parse(JSON.stringify(myAvailability.schedule)));
                        setEditScheduleMode(true);
                      }}
                    >
                      ✏️ Edit Jadwal
                    </Button>
                  </>
                ) : (
                  <>
                    {/* Weekly Schedule - Edit Mode */}
                    <div className="space-y-3">
                      {Object.entries(editedSchedule || {}).map(([day, times]) => (
                        <Card key={day} className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="capitalize font-semibold text-sm text-gray-800">
                                {day.charAt(0).toUpperCase() + day.slice(1)}
                              </span>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={times.available}
                                  onChange={(e) => {
                                    setEditedSchedule(prev => ({
                                      ...prev,
                                      [day]: { ...prev[day], available: e.target.checked }
                                    }));
                                  }}
                                  className="w-4 h-4"
                                />
                                <span className="text-xs text-gray-600">Tersedia</span>
                              </label>
                            </div>
                            {times.available && (
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-xs text-gray-600 block mb-1">Jam Mulai</label>
                                  <input
                                    type="time"
                                    value={times.startTime}
                                    onChange={(e) => {
                                      setEditedSchedule(prev => ({
                                        ...prev,
                                        [day]: { ...prev[day], startTime: e.target.value }
                                      }));
                                    }}
                                    className="w-full px-2 py-2 border border-gray-300 rounded-lg text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="text-xs text-gray-600 block mb-1">Jam Selesai</label>
                                  <input
                                    type="time"
                                    value={times.endTime}
                                    onChange={(e) => {
                                      setEditedSchedule(prev => ({
                                        ...prev,
                                        [day]: { ...prev[day], endTime: e.target.value }
                                      }));
                                    }}
                                    className="w-full px-2 py-2 border border-gray-300 rounded-lg text-xs"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>

                    {/* Save/Cancel Buttons */}
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          updateUser(currentUser.id, { schedule: editedSchedule });
                          setEditScheduleMode(false);
                          showToast("Jadwal berhasil diperbarui", "success");
                        }}
                      >
                        Simpan
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                        variant="outline"
                        onClick={() => {
                          setEditScheduleMode(false);
                          setEditedSchedule(null);
                        }}
                      >
                        Batal
                      </Button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <Card className="p-4 text-center text-gray-500">
                <p>Jadwal ketersediaan belum dikonfigurasi.</p>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProviderHome;
