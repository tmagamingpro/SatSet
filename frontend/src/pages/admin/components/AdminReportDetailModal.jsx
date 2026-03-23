import Modal from "../../../components/Modal";
import Badge from "../../../components/Badge";
import Button from "../../../components/Button";
import AppIcon from "../../../components/AppIcon";

const AdminReportDetailModal = ({
  open,
  onClose,
  selectedReport,
  typeColors,
  adminNote,
  onAdminNoteChange,
  onResolve,
}) => {
  return (
    <Modal open={open} onClose={onClose} title="Detail Laporan">
      {selectedReport && (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <Badge color={typeColors[selectedReport.type] || "#6B6B8A"}>{selectedReport.type}</Badge>
            <Badge color={selectedReport.status === "selesai" ? "#22C55E" : "#F59E0B"}>
              {selectedReport.status === "selesai" ? "Selesai" : "Pending"}
            </Badge>
          </div>

          <div className="flex flex-col gap-2">
            {[
              ["Pelapor", selectedReport.from, "user"],
              ["Jenis", selectedReport.type, "clipboard"],
              ["Tanggal", selectedReport.date, "calendar"],
            ].map(([label, value, icon]) => (
              <div key={label} className="flex gap-2">
                <span className="text-sm font-semibold text-gray-400 min-w-[80px] inline-flex items-center gap-1">
                  <AppIcon name={icon} size={12} /> {label}
                </span>
                <span className="text-sm break-words">{value}</span>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-xl p-3">
            <div className="text-xs font-semibold text-gray-400 mb-1">Deskripsi</div>
            <div className="text-sm break-words leading-relaxed">{selectedReport.desc}</div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-400 block mb-1.5">Catatan Admin</label>
            <textarea
              value={adminNote}
              onChange={(event) => onAdminNoteChange(event.target.value)}
              rows={3}
              placeholder="Tambahkan catatan penanganan..."
              className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm resize-none focus:border-sky-600 outline-none"
            />
          </div>

          {selectedReport.status !== "selesai" && (
            <Button fullWidth variant="success" onClick={() => onResolve(selectedReport)} icon={<AppIcon name="badgeCheck" size={14} />}>
              Tandai Selesai
            </Button>
          )}
        </div>
      )}
    </Modal>
  );
};

export default AdminReportDetailModal;
