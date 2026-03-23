import { useMemo, useState } from "react";
import { useApp } from "../../context/AppContext";
import TopBar from "../../layouts/TopBar";
import AdminReportCard from "./components/AdminReportCard";
import AdminReportDetailModal from "./components/AdminReportDetailModal";

const AdminReports = () => {
  const { reports, updateReport, showToast } = useApp();
  const [filter, setFilter] = useState("semua");
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [adminNote, setAdminNote] = useState("");

  const filtered = useMemo(() => {
    if (filter === "semua") return reports;
    if (filter === "pending") return reports.filter((report) => report.status !== "selesai");
    return reports.filter((report) => report.status === "selesai");
  }, [filter, reports]);

  const pendingCount = reports.filter((report) => report.status !== "selesai").length;
  const resolvedCount = reports.filter((report) => report.status === "selesai").length;

  const openDetail = (report) => {
    setSelectedReport(report);
    setAdminNote(report.adminNote || "");
    setShowDetail(true);
  };

  const handleResolve = async (report) => {
    const success = await updateReport(report.id, {
      status: "selesai",
      adminNote: adminNote.trim(),
    });
    if (!success) return;
    showToast("Laporan ditandai selesai!", "success");
    setShowDetail(false);
    setSelectedReport(null);
    setAdminNote("");
  };

  const typeColors = {
    "Penyedia Jasa": "#0284C7",
    Aplikasi: "#3B82F6",
    "Pencari Jasa": "#9C27B0",
  };

  return (
    <div className="pb-20">
      <TopBar title="Kelola Laporan" subtitle={`${reports.length} laporan masuk`} />

      <div className="px-5 pt-4">
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: "Total", value: reports.length, color: "#3B82F6" },
            { label: "Pending", value: pendingCount, color: "#F59E0B" },
            { label: "Selesai", value: resolvedCount, color: "#22C55E" },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
              <div className="font-bold text-xl" style={{ color: item.color }}>{item.value}</div>
              <div className="text-[11px] text-gray-400">{item.label}</div>
            </div>
          ))}
        </div>

        <div className="flex border-b border-gray-100 bg-white rounded-t-xl overflow-hidden mb-4">
          {[{ id: "semua", label: "Semua" }, { id: "pending", label: "Pending" }, { id: "selesai", label: "Selesai" }].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`flex-1 py-2.5 bg-transparent border-none cursor-pointer text-sm transition-all border-b-[3px]
                ${filter === tab.id ? "font-bold text-sky-600 border-sky-600" : "font-normal text-gray-400 border-transparent"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {filtered.map((report) => (
          <AdminReportCard key={report.id} report={report} typeColors={typeColors} onOpenDetail={openDetail} />
        ))}
      </div>

      <AdminReportDetailModal
        open={showDetail}
        onClose={() => setShowDetail(false)}
        selectedReport={selectedReport}
        typeColors={typeColors}
        adminNote={adminNote}
        onAdminNoteChange={setAdminNote}
        onResolve={handleResolve}
      />
    </div>
  );
};

export default AdminReports;
