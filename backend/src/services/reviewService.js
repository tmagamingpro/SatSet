import { validateCreateReviewPayload } from "../validators/reviewValidator.js";
import { BaseService } from "./baseService.js";

class ReviewService extends BaseService {
  create(payload) {
    const validationError = validateCreateReviewPayload(payload);
    if (validationError) return validationError;

    const data = payload ?? {};
    const orderId = Number(data.orderId);
    const providerId = Number(data.providerId);
    const customerId = Number(data.customerId);
    const rating = Number(data.rating);
    const comment = String(data.comment ?? "").trim();

    const order = this.state.orders.find((item) => item.id === orderId);
    if (!order) return this.fail(404, "Order tidak ditemukan.");
    if (order.providerId !== providerId || order.customerId !== customerId) {
      return this.fail(400, "Data review tidak sesuai dengan order.");
    }

    const existingIndex = this.state.reviews.findIndex(
      (item) => item.orderId === orderId && item.providerId === providerId && item.customerId === customerId,
    );

    let review;
    if (existingIndex >= 0) {
      this.state.reviews[existingIndex] = {
        ...this.state.reviews[existingIndex],
        rating,
        comment,
        createdAt: this.nowIso(),
      };
      review = this.state.reviews[existingIndex];
    } else {
      review = {
        id: this.createId(),
        orderId,
        providerId,
        customerId,
        rating,
        comment,
        createdAt: this.nowIso(),
      };
      this.state.reviews.push(review);
    }

    this.deps.createNotification(providerId, `Anda menerima ulasan baru untuk pekerjaan "${order.service}".`, "new_review");
    return this.ok(existingIndex >= 0 ? 200 : 201, { review });
  }
}

const createReviewService = (deps) => new ReviewService(deps);

export { createReviewService };
