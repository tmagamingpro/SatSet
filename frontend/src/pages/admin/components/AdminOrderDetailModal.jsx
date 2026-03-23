import Modal from "../../../components/Modal";
import Badge from "../../../components/Badge";
import Button from "../../../components/Button";
import AppIcon from "../../../components/AppIcon";
import { formatRupiah, formatDate } from "../../../utils/format";

const AdminOrderDetailModal = ({
  open,
  onClose,
  selectedOrder,
  users,
  statusColors,
  onForceComplete,
  onForceCancel,
}) => {
  return (
    <Modal open={open} onClose={onClose} title="Detail Pesanan">
      {selectedOrder && (() => {
        const customer = users.find((user) => user.id === selectedOrder.customerId);
        const provider = users.find((user) => user.id === selectedOrder.providerId);
        return (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-bold">{selectedOrder.service}</div>
                <div className="text-xs text-gray-400">ID #{selectedOrder.id}</div>
              </div>
              <Badge color={statusColors[selectedOrder.status] || "#94A3B8"}>{selectedOrder.status}</Badge>
            </div>

            <div className="flex flex-col gap-2">
              {[
                ["Customer", customer?.name || "-", "user"],
                ["Penyedia", provider?.name || "-", "hardHat"],
                ["Deskripsi", selectedOrder.description, "clipboard"],
                ["Lokasi", selectedOrder.location, "mapPin"],
                ["Harga", selectedOrder.price > 0 ? formatRupiah(selectedOrder.price) : "Belum ditentukan", "wallet"],
                ["Dibuat", formatDate(selectedOrder.createdAt), "calendar"],
              ].map(([key, value, icon]) => (
                <div key={key} className="flex gap-2">
                  <span className="text-sm font-semibold text-gray-400 min-w-[90px] inline-flex items-center gap-1">
                    <AppIcon name={icon} size={12} /> {key}
                  </span>
                  <span className="text-sm">{value}</span>
                </div>
              ))}
            </div>

            {(selectedOrder.status === "berlangsung" || selectedOrder.status === "menunggu") && (
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <Button
                  fullWidth
                  variant="success"
                  size="sm"
                  onClick={() => onForceComplete(selectedOrder)}
                  icon={<AppIcon name="badgeCheck" size={13} />}
                >
                  Paksa Selesai
                </Button>
                <Button
                  fullWidth
                  variant="danger"
                  size="sm"
                  onClick={() => onForceCancel(selectedOrder)}
                  icon={<AppIcon name="trash" size={13} />}
                >
                  Batalkan
                </Button>
              </div>
            )}
          </div>
        );
      })()}
    </Modal>
  );
};

export default AdminOrderDetailModal;
