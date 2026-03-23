import { validateRequiredFields } from "./commonValidator.js";

const validateRegisterUserPayload = (payload) => {
  const missing = validateRequiredFields(payload, ["name", "email", "password", "phone", "role"]);
  if (missing) return { status: 400, body: missing };
  return null;
};

export { validateRegisterUserPayload };
