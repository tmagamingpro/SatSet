import { useState } from "react";
import { useApp } from "../../context/AppContext";
import TopBar from "../../layouts/TopBar";
import Input from "../../components/Input";
import AppIcon from "../../components/AppIcon";
import AdminOrderCard from "./components/AdminOrderCard";
import AdminOrderDetailModal from "./components/AdminOrderDetailModal";

const AdminOrders = () => {
  const { orders, users, statusColors, updateOrder, showToast } = useApp();
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
            <AdminOrderCard
              key={order.id}
              order={order}
              customer={customer}
              provider={provider}
              statusColors={statusColors}
              onOpenDetail={openDetail}
            />
          );
        })}
      </div>

      <AdminOrderDetailModal
        open={showDetail}
        onClose={() => setShowDetail(false)}
        selectedOrder={selectedOrder}
        users={users}
        statusColors={statusColors}
        onForceComplete={handleForceComplete}
        onForceCancel={handleForceCancel}
      />
    </div>
  );
};

export default AdminOrders;
