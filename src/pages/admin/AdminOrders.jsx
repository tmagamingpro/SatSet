import { useState } from "react";
import { useApp } from "../../context/AppContext";
import TopBar from "../../layouts/TopBar";
import Card from "../../components/Card";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import Input from "../../components/Input";
import AppIcon from "../../components/AppIcon";
import { STATUS_COLORS } from "../../utils/constants";
import { formatRupiah, formatDate } from "../../utils/format";

const AdminOrders = () => {
  const { orders, users, updateOrder, showToast } = useApp();
  const [filter, setFilter] = useState("semua");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const filtered = orders
    .filter(o => filter === "semua" || o.status === filter)
    .filter(o => {
      if (!search) return true;
      const customer = users.find(u => u.id === o.customerId);
      const provider = users.find(u => u.id === o.providerId);
      return o.service.toLowerCase().includes(search.toLowerCase()) ||
        customer?.name.toLowerCase().includes(search.toLowerCase()) ||
        provider?.name.toLowerCase().includes(search.toLowerCase());
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const openDetail = (order) => {
    setSelectedOrder(order);
    setShowDetail(true);
  };

  const handleForceComplete = (order) => {
    updateOrder(order.id, { status: "selesai", completedAt: new Date().toISOString() });
    showToast("Pesanan ditandai selesai oleh admin.", "success");
    setShowDetail(false);
  };

  const handleForceCancel = (order) => {
    updateOrder(order.id, { status: "dibatalkan" });
    showToast("Pesanan dibatalkan oleh admin.", "warning");
    setShowDetail(false);
  };

  const tabs = ["semua", "menunggu", "berlangsung", "selesai", "dibatalkan"];

  return (
    <div className="pb-20">
      <TopBar title="Kelola Pesanan" subtitle={`${filtered.length} pesanan`} />

      <div className="px-5 pt-4 pb-2 bg-white border-b border-gray-100">
        <Input value={search} onChange={setSearch} placeholder="Cari layanan, customer, penyedia..." icon={<AppIcon name="search" size={16} />} />
      </div>

      <div className="flex border-b border-gray-100 bg-white overflow-x-auto">
        {tabs.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-shrink-0 px-3 py-3 bg-transparent border-none cursor-pointer text-xs capitalize transition-all border-b-[3px]
              ${filter === f ? "font-bold text-sky-600 border-sky-600" : "font-normal text-gray-400 border-transparent"}`}
          >
            {f}
            <span className="ml-1 text-[10px]">
              ({f === "semua" ? orders.length : orders.filter(o => o.status === f).length})
            </span>
          </button>
        ))}
      </div>

      <div className="px-5 pt-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="mb-3 flex justify-center"><AppIcon name="clipboard" size={34} /></div>
            <p>Tidak ada pesanan ditemukan</p>
          </div>
        ) : filtered.map(order => {
          const customer = users.find(u => u.id === order.customerId);
          const provider = users.find(u => u.id === order.providerId);
          return (
            <Card key={order.id} className="mb-3" onClick={() => openDetail(order)}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 min-w-0 mr-2">
                  <div className="font-bold text-sm truncate">{order.service}</div>
                  <div className="text-[11px] text-gray-400 mt-0.5 inline-flex items-center gap-1">
                    <AppIcon name="user" size={11} /> {customer?.name} {"->"} <AppIcon name="hardHat" size={11} /> {provider?.name}
                  </div>
                </div>
                <Badge color={STATUS_COLORS[order.status]}>{order.status}</Badge>
              </div>
              <div className="text-xs text-gray-400 mb-1 inline-flex items-center gap-1"><AppIcon name="mapPin" size={12} /> {order.location}</div>
              <div className="flex items-center justify-between mt-2">
                {order.price > 0
                  ? <span className="text-sm font-semibold text-sky-600">{formatRupiah(order.price)}</span>
                  : <span />}
                <span className="text-[11px] text-gray-400 inline-flex items-center gap-1"><AppIcon name="calendar" size={11} /> {formatDate(order.createdAt, { month: "short", day: "numeric", year: "numeric" })}</span>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal open={showDetail} onClose={() => setShowDetail(false)} title="Detail Pesanan">
        {selectedOrder && (() => {
          const customer = users.find(u => u.id === selectedOrder.customerId);
          const provider = users.find(u => u.id === selectedOrder.providerId);
          return (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-bold">{selectedOrder.service}</div>
                  <div className="text-xs text-gray-400">ID #{selectedOrder.id}</div>
                </div>
                <Badge color={STATUS_COLORS[selectedOrder.status]}>{selectedOrder.status}</Badge>
              </div>

              <div className="flex flex-col gap-2">
                {[
                  ["Customer", customer?.name || "-", "user"],
                  ["Penyedia", provider?.name || "-", "hardHat"],
                  ["Deskripsi", selectedOrder.description, "clipboard"],
                  ["Lokasi", selectedOrder.location, "mapPin"],
                  ["Harga", selectedOrder.price > 0 ? formatRupiah(selectedOrder.price) : "Belum ditentukan", "wallet"],
                  ["Dibuat", formatDate(selectedOrder.createdAt), "calendar"],
                ].map(([k, v, icon]) => (
                  <div key={k} className="flex gap-2">
                    <span className="text-sm font-semibold text-gray-400 min-w-[90px] inline-flex items-center gap-1"><AppIcon name={icon} size={12} /> {k}</span>
                    <span className="text-sm">{v}</span>
                  </div>
                ))}
              </div>

              {(selectedOrder.status === "berlangsung" || selectedOrder.status === "menunggu") && (
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <Button fullWidth variant="success" size="sm" onClick={() => handleForceComplete(selectedOrder)} icon={<AppIcon name="badgeCheck" size={13} />}>Paksa Selesai</Button>
                  <Button fullWidth variant="danger" size="sm" onClick={() => handleForceCancel(selectedOrder)} icon={<AppIcon name="trash" size={13} />}>Batalkan</Button>
                </div>
              )}
            </div>
          );
        })()}
      </Modal>
    </div>
  );
};

export default AdminOrders;
