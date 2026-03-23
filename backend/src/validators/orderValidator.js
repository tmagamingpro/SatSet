import { validateRequiredFields } from "./commonValidator.js";

const validateCreateOrderPayload = (payload) => {
  const missing = validateRequiredFields(payload, ["customerId", "providerId", "service", "description", "location"]);
  if (missing) return { status: 400, body: missing };
  return null;
};

export { validateCreateOrderPayload };
