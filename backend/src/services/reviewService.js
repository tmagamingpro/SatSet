import { validateCreateReviewPayload } from "../validators/reviewValidator.js";

const createReviewService = (deps) => {
  const { state, createId, nowIso, createNotification } = deps;

  const create = (payload) => {
    const validationError = validateCreateReviewPayload(payload);
    if (validationError) return validationError;

    const data = payload ?? {};
    const orderId = Number(data.orderId);
    const providerId = Number(data.providerId);
    const customerId = Number(data.customerId);
    const rating = Number(data.rating);
    const comment = String(data.comment ?? "").trim();

    const order = state.orders.find((item) => item.id === orderId);
    if (!order) return { status: 404, body: { message: "Order tidak ditemukan." } };
    if (order.providerId !== providerId || order.customerId !== customerId) {
      return { status: 400, body: { message: "Data review tidak sesuai dengan order." } };
    }

    const existingIndex = state.reviews.findIndex(
      (item) => item.orderId === orderId && item.providerId === providerId && item.customerId === customerId,
    );

    let review;
    if (existingIndex >= 0) {
      state.reviews[existingIndex] = {
        ...state.reviews[existingIndex],
        rating,
        comment,
        createdAt: nowIso(),
      };
      review = state.reviews[existingIndex];
    } else {
      review = {
        id: createId(),
        orderId,
        providerId,
        customerId,
        rating,
        comment,
        createdAt: nowIso(),
      };
      state.reviews.push(review);
    }

    createNotification(providerId, `Anda menerima ulasan baru untuk pekerjaan "${order.service}".`, "new_review");
    return { status: existingIndex >= 0 ? 200 : 201, body: { review } };
  };

  return {
    create,
  };
};

export { createReviewService };
