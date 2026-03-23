import Card from "../../../components/Card";
import Badge from "../../../components/Badge";
import Button from "../../../components/Button";
import AppIcon from "../../../components/AppIcon";

const AdminReportCard = ({ report, typeColors, onOpenDetail }) => {
  return (
    <Card className="mb-3" onClick={() => onOpenDetail(report)}>
      <div className="flex justify-between items-start gap-2 mb-2">
        <Badge color={typeColors[report.type] || "#6B6B8A"}>{report.type}</Badge>
        <div className="flex items-center gap-2 shrink-0">
          <Badge color={report.status === "selesai" ? "#22C55E" : "#F59E0B"}>
            {report.status === "selesai" ? "Selesai" : "Pending"}
          </Badge>
          <span className="text-[11px] text-gray-400">{report.date}</span>
        </div>
      </div>
      <div className="font-semibold text-sm mb-1 break-words">Laporan {report.type}</div>
      <div className="text-xs text-gray-400 mb-2 flex items-start gap-1.5">
        <AppIcon name="user" size={11} className="mt-0.5 shrink-0" />
        <span className="break-words leading-relaxed">Dari: {report.from}</span>
      </div>
      <div className="text-sm mb-3 flex items-start gap-1.5">
        <AppIcon name="clipboard" size={12} className="mt-0.5 shrink-0" />
        <span className="break-words leading-relaxed">{report.desc}</span>
      </div>
      {report.status !== "selesai" && (
        <Button
          size="sm"
          variant="success"
          onClick={(event) => {
            event.stopPropagation();
            onOpenDetail(report);
          }}
          icon={<AppIcon name="badgeCheck" size={13} />}
        >
          Tangani
        </Button>
      )}
    </Card>
  );
};

export default AdminReportCard;
