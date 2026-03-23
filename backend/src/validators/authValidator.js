import { validateRequiredFields } from "./commonValidator.js";

const validateLoginPayload = (payload) => {
  const missing = validateRequiredFields(payload, ["email", "password"]);
  if (missing) return { status: 400, body: missing };
  return null;
};

export { validateLoginPayload };
