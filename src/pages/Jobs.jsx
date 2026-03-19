import { useState } from "react";
import { useApp } from "../context/AppContext";
import TopBar from "../layouts/TopBar";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Button from "../components/Button";
import AppIcon from "../components/AppIcon";
import { STATUS_COLORS } from "../utils/constants";
import { formatRupiah, formatDate } from "../utils/format";

const Jobs = () => {
  const { orders, currentUser, users, updateOrder, showToast } = useApp();
  const [filter, setFilter] = useState("menunggu");

  const myJobs = orders.filter(o => o.providerId === currentUser?.id);
  const filtered = filter === "semua" ? myJobs : myJobs.filter(o => o.status === filter);
  const pendingCount = myJobs.filter(o => o.status === "menunggu").length;

  return (
    <div className="pb-20">
      <TopBar title="Pekerjaan" subtitle={pendingCount > 0 ? `${pendingCount} permintaan baru` : "Tidak ada permintaan baru"} />

      <div className="flex border-b border-gray-100 bg-white overflow-x-auto">
        {["menunggu", "berlangsung", "selesai", "semua"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-shrink-0 px-4 py-3 bg-transparent border-none cursor-pointer text-xs capitalize transition-all border-b-[3px]
              ${filter === f ? "font-bold text-sky-600 border-sky-600" : "font-normal text-gray-400 border-transparent"}`}
          >
            {f}
            {f === "menunggu" && pendingCount > 0 && (
              <span className="ml-1 bg-sky-600 text-white rounded-full w-4 h-4 text-[10px] inline-flex items-center justify-center">{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      <div className="px-5 pt-5">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="mb-3 flex justify-center"><AppIcon name="briefcase" size={36} /></div>
            <p className="font-semibold">Tidak ada pekerjaan di sini</p>
          </div>
        ) : filtered.map(order => {
          const customer = users.find(u => u.id === order.customerId);
          return (
            <Card key={order.id} className="mb-3">
              <div className="flex justify-between mb-2.5">
                <div>
                  <div className="font-bold text-sm">{order.service}</div>
                  <div className="text-xs text-gray-400 inline-flex items-center gap-1"><AppIcon name="user" size={11} /> {customer?.name}</div>
                </div>
                <Badge color={STATUS_COLORS[order.status]}>{order.status.toUpperCase()}</Badge>
              </div>
              <div className="text-sm text-gray-400 mb-1.5 inline-flex items-center gap-1"><AppIcon name="clipboard" size={12} /> {order.description}</div>
              <div className="text-sm text-gray-400 mb-1.5 inline-flex items-center gap-1"><AppIcon name="mapPin" size={12} /> {order.location}</div>
              {order.price > 0 && <div className="text-sm font-semibold text-sky-600 inline-flex items-center gap-1"><AppIcon name="wallet" size={12} /> {formatRupiah(order.price)}</div>}
              <div className="text-[11px] text-gray-400 mt-2 inline-flex items-center gap-1"><AppIcon name="calendar" size={11} /> {formatDate(order.createdAt, { year: "numeric", month: "short", day: "numeric" })}</div>
              {order.status === "menunggu" && (
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="success" onClick={() => { updateOrder(order.id, { status: "berlangsung" }); showToast("Pekerjaan diterima!", "success"); }} icon={<AppIcon name="badgeCheck" size={13} />}>Terima</Button>
                  <Button size="sm" variant="danger" onClick={() => { updateOrder(order.id, { status: "ditolak" }); showToast("Pekerjaan ditolak.", "error"); }} icon={<AppIcon name="trash" size={13} />}>Tolak</Button>
                </div>
              )}
              {order.status === "berlangsung" && (
                <Button size="sm" variant="success" className="mt-3" onClick={() => { updateOrder(order.id, { status: "selesai", completedAt: new Date().toISOString() }); showToast("Pekerjaan selesai!", "success"); }} icon={<AppIcon name="badgeCheck" size={13} />}>Tandai Selesai</Button>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Jobs;
