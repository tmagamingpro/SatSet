import { useState } from "react";
import { useApp } from "../context/AppContext";
import TopBar from "../layouts/TopBar";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Button from "../components/Button";
import Modal from "../components/Modal";
import AppIcon from "../components/AppIcon";
import { STATUS_COLORS } from "../utils/constants";
import { formatRupiah, formatDate } from "../utils/format";

const Jobs = () => {
  const { orders, currentUser, users, updateOrder, showToast } = useApp();
  const [filter, setFilter] = useState("menunggu");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  const myJobs = orders.filter(o => o.providerId === currentUser?.id);
  const filtered = filter === "semua" ? myJobs : myJobs.filter(o => o.status === filter);
  const pendingCount = myJobs.filter(o => o.status === "menunggu").length;
  const openRejectModal = (order) => {
    setSelectedOrder(order);
    setCancelReason("");
    setShowRejectModal(true);
  };
  const closeRejectModal = () => {
    setShowRejectModal(false);
    setSelectedOrder(null);
    setCancelReason("");
  };
  const handleReject = () => {
    if (!selectedOrder) return;
    if (!cancelReason.trim()) {
      showToast("Alasan pembatalan wajib diisi.", "error");
      return;
    }
    updateOrder(selectedOrder.id, {
      status: "ditolak",
      cancellationReason: cancelReason.trim(),
      cancelledBy: "provider",
      cancelledAt: new Date().toISOString(),
    });
    showToast("Pesanan ditolak dengan alasan.", "warning");
    closeRejectModal();
  };

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
              <div className="flex justify-between items-start gap-2 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm">{order.service}</div>
                  <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                    <AppIcon name="user" size={11} />
                    <span className="break-words">{customer?.name}</span>
                  </div>
                </div>
                <Badge color={STATUS_COLORS[order.status]}>{order.status.toUpperCase()}</Badge>
              </div>
              <div className="text-sm text-gray-500 mb-2 flex items-start gap-1.5">
                <AppIcon name="clipboard" size={12} className="mt-1 shrink-0" />
                <span className="break-words leading-relaxed">{order.description}</span>
              </div>
              <div className="text-sm text-gray-500 mb-2 flex items-start gap-1.5">
                <AppIcon name="mapPin" size={12} className="mt-1 shrink-0" />
                <span className="break-words leading-relaxed">{order.location}</span>
              </div>
              {order.price > 0 && (
                <div className="text-sm font-semibold text-sky-600 inline-flex items-center gap-1">
                  <AppIcon name="wallet" size={12} /> {formatRupiah(order.price)}
                </div>
              )}
              <div className="text-[11px] text-gray-400 mt-2 inline-flex items-center gap-1">
                <AppIcon name="calendar" size={11} /> {formatDate(order.createdAt, { year: "numeric", month: "short", day: "numeric" })}
              </div>
              {(order.status === "ditolak" || order.status === "dibatalkan") && order.cancellationReason && (
                <div className="mt-2 rounded-lg border border-rose-100 bg-rose-50 p-2.5">
                  <p className="text-[11px] font-semibold text-rose-600">Alasan Pembatalan</p>
                  <p className="text-xs text-rose-700 mt-0.5 break-words leading-relaxed">{order.cancellationReason}</p>
                </div>
              )}
              {order.status === "menunggu" && (
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="success" onClick={() => { updateOrder(order.id, { status: "berlangsung" }); showToast("Pekerjaan diterima!", "success"); }} icon={<AppIcon name="badgeCheck" size={13} />}>Terima</Button>
                  <Button size="sm" variant="danger" onClick={() => openRejectModal(order)} icon={<AppIcon name="trash" size={13} />}>Tolak</Button>
                </div>
              )}
              {order.status === "berlangsung" && (
                <Button size="sm" variant="success" className="mt-3" onClick={() => { updateOrder(order.id, { status: "selesai", completedAt: new Date().toISOString(), completedBy: "provider" }); showToast("Pekerjaan selesai!", "success"); }} icon={<AppIcon name="badgeCheck" size={13} />}>Tandai Selesai</Button>
              )}
            </Card>
          );
        })}
      </div>

      <Modal open={showRejectModal} onClose={closeRejectModal} title="Alasan Penolakan Pesanan">
        <div className="flex flex-col gap-3.5">
          <p className="text-sm text-gray-500">
            Jelaskan alasan mengapa pesanan ini ditolak agar pencari jasa mendapatkan informasi yang jelas.
          </p>
          <div>
            <label className="text-xs font-semibold text-gray-400 block mb-1.5">Alasan *</label>
            <textarea
              value={cancelReason}
              onChange={(event) => setCancelReason(event.target.value)}
              rows={4}
              placeholder="Contoh: Jadwal penuh pada tanggal yang diminta."
              className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm resize-y focus:border-sky-600 outline-none"
            />
          </div>
          <div className="flex gap-2">
            <Button fullWidth variant="outline" onClick={closeRejectModal}>Batal</Button>
            <Button fullWidth variant="danger" onClick={handleReject}>Kirim Alasan & Tolak</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Jobs;
