import { validateCreateReportPayload } from "../validators/reportValidator.js";
import { BaseService } from "./baseService.js";

class ReportService extends BaseService {
  create(payload) {
    const validationError = validateCreateReportPayload(payload);
    if (validationError) return validationError;
    const data = payload ?? {};

    const reporter = this.state.users.find((user) => user.id === Number(data.fromUserId));
    if (!reporter) return this.fail(404, "Pelapor tidak ditemukan.");

    const report = {
      id: this.createId(),
      fromUserId: reporter.id,
      from: reporter.name,
      type: data.type || this.deps.toRoleLabel(reporter.role),
      desc: data.desc,
      date: this.nowIso().slice(0, 10),
      status: "pending",
      adminNote: "",
      orderId: data.orderId ? Number(data.orderId) : undefined,
    };
    this.state.reports.push(report);
    return this.ok(201, { report });
  }

  update(reportId, payload) {
    const id = Number(reportId);
    const index = this.state.reports.findIndex((report) => report.id === id);
    if (index === -1) return this.fail(404, "Laporan tidak ditemukan.");

    const data = payload ?? {};
    this.state.reports[index] = {
      ...this.state.reports[index],
      status: data.status || this.state.reports[index].status,
      adminNote: data.adminNote ?? this.state.reports[index].adminNote,
      resolvedAt: data.status === "selesai" ? this.nowIso() : this.state.reports[index].resolvedAt,
    };
    return this.ok(200, { report: this.state.reports[index] });
  }
}

const createReportService = (deps) => new ReportService(deps);

export { createReportService };
