import { useState } from "react";
import { useApp } from "../../context/AppContext";
import TopBar from "../../layouts/TopBar";
import Card from "../../components/Card";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import AppIcon from "../../components/AppIcon";
import { MOCK_REPORTS } from "../../utils/constants";

const AdminReports = () => {
  const { showToast } = useApp();
  const [resolved, setResolved] = useState([]);
  const [filter, setFilter] = useState("semua");
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [adminNote, setAdminNote] = useState("");

  const filtered = filter === "semua"
    ? MOCK_REPORTS
    : filter === "pending"
    ? MOCK_REPORTS.filter(r => !resolved.includes(r.id))
    : MOCK_REPORTS.filter(r => resolved.includes(r.id));

  const handleResolve = (id) => {
    setResolved(p => [...p, id]);
    showToast("Laporan ditandai selesai!", "success");
    setShowDetail(false);
  };

  const openDetail = (report) => {
    setSelectedReport(report);
    setAdminNote("");
    setShowDetail(true);
  };

  const typeColors = {
    "Penyedia Jasa": "#0284C7",
    "Aplikasi": "#3B82F6",
    "Pencari Jasa": "#9C27B0",
  };

  return (
    <div className="pb-20">
      <TopBar title="Kelola Laporan" subtitle={`${MOCK_REPORTS.length} laporan masuk`} />

      <div className="px-5 pt-4">
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: "Total", value: MOCK_REPORTS.length, color: "#3B82F6" },
            { label: "Pending", value: MOCK_REPORTS.length - resolved.length, color: "#F59E0B" },
            { label: "Selesai", value: resolved.length, color: "#22C55E" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
              <div className="font-bold text-xl" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[11px] text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex border-b border-gray-100 bg-white rounded-t-xl overflow-hidden mb-4">
          {[{ id: "semua", label: "Semua" }, { id: "pending", label: "Pending" }, { id: "selesai", label: "Selesai" }].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`flex-1 py-2.5 bg-transparent border-none cursor-pointer text-sm transition-all border-b-[3px]
                ${filter === f.id ? "font-bold text-sky-600 border-sky-600" : "font-normal text-gray-400 border-transparent"}`}
            >{f.label}</button>
          ))}
        </div>

        {filtered.map(r => (
          <Card key={r.id} className="mb-3" onClick={() => openDetail(r)}>
            <div className="flex justify-between items-start gap-2 mb-2">
              <Badge color={typeColors[r.type] || "#6B6B8A"}>{r.type}</Badge>
              <div className="flex items-center gap-2 shrink-0">
                <Badge color={resolved.includes(r.id) ? "#22C55E" : "#F59E0B"}>
                  {resolved.includes(r.id) ? "Selesai" : "Pending"}
                </Badge>
                <span className="text-[11px] text-gray-400">{r.date}</span>
              </div>
            </div>
            <div className="font-semibold text-sm mb-1 break-words">Laporan {r.type}</div>
            <div className="text-xs text-gray-400 mb-2 flex items-start gap-1.5">
              <AppIcon name="user" size={11} className="mt-0.5 shrink-0" />
              <span className="break-words leading-relaxed">Dari: {r.from}</span>
            </div>
            <div className="text-sm mb-3 flex items-start gap-1.5">
              <AppIcon name="clipboard" size={12} className="mt-0.5 shrink-0" />
              <span className="break-words leading-relaxed">{r.desc}</span>
            </div>
            {!resolved.includes(r.id) && (
              <Button size="sm" variant="success" onClick={(e) => { e.stopPropagation(); handleResolve(r.id); }} icon={<AppIcon name="badgeCheck" size={13} />}>
                Tandai Selesai
              </Button>
            )}
          </Card>
        ))}
      </div>

      <Modal open={showDetail} onClose={() => setShowDetail(false)} title="Detail Laporan">
        {selectedReport && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <Badge color={typeColors[selectedReport.type] || "#6B6B8A"}>{selectedReport.type}</Badge>
              <Badge color={resolved.includes(selectedReport.id) ? "#22C55E" : "#F59E0B"}>
                {resolved.includes(selectedReport.id) ? "Selesai" : "Pending"}
              </Badge>
            </div>

            <div className="flex flex-col gap-2">
              {[
                ["Pelapor", selectedReport.from, "user"],
                ["Jenis", selectedReport.type, "clipboard"],
                ["Tanggal", selectedReport.date, "calendar"],
              ].map(([k, v, icon]) => (
                <div key={k} className="flex gap-2">
                  <span className="text-sm font-semibold text-gray-400 min-w-[80px] inline-flex items-center gap-1"><AppIcon name={icon} size={12} /> {k}</span>
                  <span className="text-sm break-words">{v}</span>
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
                onChange={e => setAdminNote(e.target.value)}
                rows={3}
                placeholder="Tambahkan catatan penanganan..."
                className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm resize-none focus:border-sky-600 outline-none"
              />
            </div>

            {!resolved.includes(selectedReport.id) && (
              <Button fullWidth variant="success" onClick={() => handleResolve(selectedReport.id)} icon={<AppIcon name="badgeCheck" size={14} />}>
                Tandai Selesai
              </Button>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminReports;
