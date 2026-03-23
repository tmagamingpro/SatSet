import { validateRequiredFields } from "./commonValidator.js";

const validateCreateNotificationPayload = (payload) => {
  const missing = validateRequiredFields(payload, ["userId", "message"]);
  if (missing) return { status: 400, body: missing };
  return null;
};

export { validateCreateNotificationPayload };
