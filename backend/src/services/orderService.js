import { validateCreateOrderPayload } from "../validators/orderValidator.js";

const createOrderService = (deps) => {
  const { state, createId, nowIso, CLOSED_ORDER_STATUSES, createNotification, clearChatsByOrder } = deps;

  const create = (payload) => {
    const validationError = validateCreateOrderPayload(payload);
    if (validationError) return validationError;
    const data = payload ?? {};

    const order = {
      id: createId(),
      ...data,
      status: "menunggu",
      createdAt: nowIso(),
      price: Number(data.price || 0),
    };

    state.orders.push(order);
    createNotification(order.providerId, "Ada permintaan jasa baru!", "new_request");
    return { status: 201, body: { order } };
  };

  const update = (orderId, payload) => {
    const id = Number(orderId);
    const index = state.orders.findIndex((order) => order.id === id);
    if (index === -1) {
      return { status: 404, body: { message: "Order tidak ditemukan." } };
    }

    const data = payload ?? {};
    const previous = state.orders[index];
    state.orders[index] = { ...state.orders[index], ...data };
    const updated = state.orders[index];

    const isNowCompleted = updated.status === "selesai" && previous.status !== "selesai";
    if (isNowCompleted && data.completedBy === "provider") {
      createNotification(
        previous.customerId,
        `Pekerjaan "${previous.service}" dinyatakan selesai oleh penyedia jasa.`,
        "job_completed",
      );
    } else if (isNowCompleted && data.completedBy === "customer") {
      createNotification(
        previous.providerId,
        `Pekerjaan "${previous.service}" telah dikonfirmasi selesai oleh pencari jasa.`,
        "job_completed",
      );
    }

    const isRejectedByProvider =
      (updated.status === "ditolak" || updated.status === "dibatalkan") &&
      previous.status !== updated.status &&
      data.cancelledBy === "provider";
    if (isRejectedByProvider) {
      const reasonText = data.cancellationReason ? ` Alasan: ${data.cancellationReason}` : "";
      createNotification(
        previous.customerId,
        `Pesanan "${previous.service}" dibatalkan oleh penyedia jasa.${reasonText}`,
        "job_cancelled",
      );
    }

    const isCancelledByCustomer =
      updated.status === "dibatalkan" &&
      previous.status !== "dibatalkan" &&
      data.cancelledBy === "customer";
    if (isCancelledByCustomer) {
      const reasonText = data.cancellationReason ? ` Alasan: ${data.cancellationReason}` : "";
      createNotification(
        previous.providerId,
        `Pesanan "${previous.service}" dibatalkan oleh pencari jasa.${reasonText}`,
        "job_cancelled",
      );
    }

    if (CLOSED_ORDER_STATUSES.has(updated.status)) {
      clearChatsByOrder(updated.id);
    }

    return { status: 200, body: { order: updated } };
  };

  return {
    create,
    update,
  };
};

export { createOrderService };
