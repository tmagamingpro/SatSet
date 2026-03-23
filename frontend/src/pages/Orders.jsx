import { useState } from "react";
import { useApp } from "../context/AppContext";
import TopBar from "../layouts/TopBar";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Button from "../components/Button";
import Modal from "../components/Modal";
import AppIcon from "../components/AppIcon";
import { formatRupiah, formatDate } from "../utils/format";

const Orders = () => {
  const { orders, currentUser, users, statusColors, updateOrder, addReport, showToast } = useApp();
  const [filter, setFilter] = useState("semua");
  const [showReport, setShowReport] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [report, setReport] = useState("");
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const isProvider = currentUser?.role === "penyedia";

  const myOrders = orders.filter(o => (isProvider ? o.providerId === currentUser?.id : o.customerId === currentUser?.id));
  const filtered = filter === "semua" ? myOrders : myOrders.filter(o => o.status === filter);

  const openCancelModal = (order) => {
    setSelectedOrder(order);
    setCancelReason("");
    setShowCancelModal(true);
  };
  const closeCancelModal = () => {
    setShowCancelModal(false);
    setSelectedOrder(null);
    setCancelReason("");
  };
  const handleCancel = () => {
    if (!selectedOrder) return;
    if (!cancelReason.trim()) {
      showToast("Alasan pembatalan wajib diisi.", "error");
      return;
    }
    updateOrder(selectedOrder.id, {
      status: "dibatalkan",
      cancellationReason: cancelReason.trim(),
      cancelledBy: "customer",
      cancelledAt: new Date().toISOString(),
    });
    showToast("Pesanan dibatalkan dengan alasan.", "warning");
    closeCancelModal();
  };
  const handleConfirm = (order) => { updateOrder(order.id, { status: "selesai", completedAt: new Date().toISOString(), completedBy: "customer" }); showToast("Pekerjaan dikonfirmasi selesai!", "success"); setShowRating(true); };
  const handleSubmitReport = async () => {
    if (!report.trim()) {
      showToast("Deskripsi laporan wajib diisi.", "error");
      return;
    }
    const success = await addReport({
      fromUserId: currentUser?.id,
      desc: report.trim(),
    });
    if (!success) return;
    showToast("Laporan berhasil dikirim!", "success");
    setShowReport(false);
    setReport("");
  };

  return (
    <div className="pb-20">
      <TopBar
        title={isProvider ? "Riwayat Pekerjaan" : "Pesanan Saya"}
        subtitle={`${myOrders.length} total ${isProvider ? "pekerjaan" : "pesanan"}`}
        actions={
          <button onClick={() => setShowReport(true)} className="bg-transparent border-none text-sky-600 cursor-pointer font-semibold text-sm inline-flex items-center gap-1">
            <AppIcon name="plus" size={13} /> Laporan
          </button>
        }
      />

      <div className="flex border-b border-gray-100 bg-white">
        {["semua", "menunggu", "berlangsung", "selesai"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-3 px-1 bg-transparent border-none cursor-pointer text-xs capitalize transition-all
              border-b-[3px] ${filter === f ? "font-bold text-sky-600 border-sky-600" : "font-normal text-gray-400 border-transparent"}`}
          >{f}</button>
        ))}
      </div>

      <div className="px-5 pt-5">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="mb-3 flex justify-center"><AppIcon name="clipboard" size={36} /></div>
            <p className="font-semibold">Belum ada pesanan</p>
          </div>
        ) : filtered.map(order => {
          const provider = users.find(u => u.id === order.providerId);
          const customer = users.find(u => u.id === order.customerId);
          return (
            <Card key={order.id} className="mb-3">
              <div className="flex justify-between items-start gap-2 mb-3">
                <div className="flex-1 min-w-0 text-left">
                  <div className="font-bold text-sm">{order.service}</div>
                  <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                    <AppIcon name={isProvider ? "user" : "hardHat"} size={11} />
                    <span className="break-words">{isProvider ? customer?.name : provider?.name}</span>
                  </div>
                </div>
                <Badge color={statusColors[order.status] || "#94A3B8"}>{order.status.toUpperCase()}</Badge>
              </div>
              <div className="text-sm text-gray-400 mb-2 flex items-start gap-1.5 text-left">
                <AppIcon name="clipboard" size={12} className="mt-1 shrink-0" />
                <span className="break-words leading-relaxed">{order.description}</span>
              </div>
              <div className="text-sm text-gray-400 mb-2 flex items-start gap-1.5 text-left">
                <AppIcon name="mapPin" size={12} className="mt-1 shrink-0" />
                <span className="break-words leading-relaxed">{order.location}</span>
              </div>
              {order.price > 0 && <div className="text-sm font-semibold text-sky-600 inline-flex items-center gap-1"><AppIcon name="wallet" size={12} /> {formatRupiah(order.price)}</div>}
              <div className="text-[11px] text-gray-400 mt-2 inline-flex items-center gap-1"><AppIcon name="calendar" size={11} /> {formatDate(order.createdAt, { year: "numeric", month: "short", day: "numeric" })}</div>
              {(order.status === "ditolak" || order.status === "dibatalkan") && order.cancellationReason && (
                <div className="mt-2 rounded-lg border border-rose-100 bg-rose-50 p-2.5 text-left">
                  <p className="text-[11px] font-semibold text-rose-600">Alasan Pembatalan</p>
                  <p className="text-xs text-rose-700 mt-0.5 break-words leading-relaxed">{order.cancellationReason}</p>
                </div>
              )}
              {!isProvider && order.status === "berlangsung" && (
                <div className="flex gap-2 mt-3">
                  <Button size="sm" onClick={() => handleConfirm(order)} icon={<AppIcon name="badgeCheck" size={13} />}>Konfirmasi Selesai</Button>
                  <Button size="sm" variant="outline" onClick={() => openCancelModal(order)}>Batalkan</Button>
                </div>
              )}
              {!isProvider && order.status === "menunggu" && (
                <Button size="sm" variant="outline" className="mt-3" onClick={() => openCancelModal(order)}>Batalkan</Button>
              )}
            </Card>
          );
        })}
      </div>

      <Modal open={showReport} onClose={() => setShowReport(false)} title="Buat Laporan">
        <div className="flex flex-col gap-3.5">
          <p className="text-sm text-gray-400">Laporkan masalah terkait pekerjaan atau penyedia jasa.</p>
          <div>
            <label className="text-xs font-semibold text-gray-400 block mb-1.5">Deskripsi Laporan *</label>
            <textarea value={report} onChange={e => setReport(e.target.value)} rows={4} placeholder="Jelaskan masalah yang Anda alami..."
              className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm resize-y" />
          </div>
          <Button fullWidth onClick={handleSubmitReport}>Kirim Laporan</Button>
        </div>
      </Modal>

      <Modal open={showRating} onClose={() => setShowRating(false)} title="Beri Penilaian">
        <div className="flex flex-col gap-3.5 text-center">
          <p className="text-gray-400 text-sm">Bagaimana pengalaman Anda?</p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map(s => (
              <button key={s} onClick={() => setRating(s)} className="bg-transparent border-none cursor-pointer" style={{ color: s <= rating ? "#FFC107" : "#E5E7EB" }}>
                <AppIcon name="star" size={30} />
              </button>
            ))}
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-400 block mb-1.5">Ulasan (opsional)</label>
            <textarea value={review} onChange={e => setReview(e.target.value)} rows={3} placeholder="Tuliskan pengalaman Anda..."
              className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm resize-none" />
          </div>
          <Button fullWidth size="lg" onClick={() => { showToast(`Rating ${rating} berhasil diberikan!`, "success"); setShowRating(false); }} icon={<AppIcon name="star" size={14} />}>Kirim Penilaian</Button>
        </div>
      </Modal>

      <Modal open={showCancelModal} onClose={closeCancelModal} title="Alasan Pembatalan Pesanan">
        <div className="flex flex-col gap-3.5">
          <p className="text-sm text-gray-500">
            Jelaskan alasan pembatalan agar penyedia jasa memahami kondisi Anda.
          </p>
          <div>
            <label className="text-xs font-semibold text-gray-400 block mb-1.5">Alasan *</label>
            <textarea
              value={cancelReason}
              onChange={(event) => setCancelReason(event.target.value)}
              rows={4}
              placeholder="Contoh: Jadwal saya berubah mendadak."
              className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm resize-y focus:border-sky-600 outline-none"
            />
          </div>
          <div className="flex gap-2">
            <Button fullWidth variant="outline" onClick={closeCancelModal}>Batal</Button>
            <Button fullWidth variant="danger" onClick={handleCancel}>Kirim Alasan & Batalkan</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Orders;
