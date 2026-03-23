import { validateRequiredFields } from "./commonValidator.js";

const validateCreateReportPayload = (payload) => {
  const missing = validateRequiredFields(payload, ["fromUserId", "desc"]);
  if (missing) return { status: 400, body: missing };
  return null;
};

export { validateCreateReportPayload };
