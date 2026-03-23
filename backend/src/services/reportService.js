import { validateCreateReportPayload } from "../validators/reportValidator.js";

const createReportService = (deps) => {
  const { state, createId, nowIso, toRoleLabel } = deps;

  const create = (payload) => {
    const validationError = validateCreateReportPayload(payload);
    if (validationError) return validationError;
    const data = payload ?? {};

    const reporter = state.users.find((user) => user.id === Number(data.fromUserId));
    if (!reporter) {
      return { status: 404, body: { message: "Pelapor tidak ditemukan." } };
    }

    const report = {
      id: createId(),
      fromUserId: reporter.id,
      from: reporter.name,
      type: data.type || toRoleLabel(reporter.role),
      desc: data.desc,
      date: nowIso().slice(0, 10),
      status: "pending",
      adminNote: "",
      orderId: data.orderId ? Number(data.orderId) : undefined,
    };
    state.reports.push(report);
    return { status: 201, body: { report } };
  };

  const update = (reportId, payload) => {
    const id = Number(reportId);
    const index = state.reports.findIndex((report) => report.id === id);
    if (index === -1) {
      return { status: 404, body: { message: "Laporan tidak ditemukan." } };
    }

    const data = payload ?? {};
    state.reports[index] = {
      ...state.reports[index],
      status: data.status || state.reports[index].status,
      adminNote: data.adminNote ?? state.reports[index].adminNote,
      resolvedAt: data.status === "selesai" ? nowIso() : state.reports[index].resolvedAt,
    };
    return { status: 200, body: { report: state.reports[index] } };
  };

  return {
    create,
    update,
  };
};

export { createReportService };
