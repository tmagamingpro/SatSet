import { validateRequiredFields } from "./commonValidator.js";

const validateCreateReviewPayload = (payload) => {
  const missing = validateRequiredFields(payload, ["orderId", "providerId", "customerId", "rating"]);
  if (missing) return { status: 400, body: missing };

  const rating = Number(payload?.rating);
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return { status: 400, body: { message: "Rating harus antara 1 sampai 5." } };
  }

  return null;
};

export { validateCreateReviewPayload };
