import { validateCreateOrderPayload } from "../validators/orderValidator.js";
import { BaseService } from "./baseService.js";

class CompletionNotifier {
  constructor(deps) {
    this.deps = deps;
  }

  // To be implemented by subclasses.
  notify(_previous, _data) {}
}

class ProviderCompletionNotifier extends CompletionNotifier {
  notify(previous) {
    this.deps.createNotification(
      previous.customerId,
      `Pekerjaan "${previous.service}" dinyatakan selesai oleh penyedia jasa.`,
      "job_completed",
    );
  }
}

class CustomerCompletionNotifier extends CompletionNotifier {
  notify(previous) {
    this.deps.createNotification(
      previous.providerId,
      `Pekerjaan "${previous.service}" telah dikonfirmasi selesai oleh pencari jasa.`,
      "job_completed",
    );
  }
}

class ProviderCancellationNotifier extends CompletionNotifier {
  notify(previous, data) {
    const reasonText = data.cancellationReason ? ` Alasan: ${data.cancellationReason}` : "";
    this.deps.createNotification(
      previous.customerId,
      `Pesanan "${previous.service}" dibatalkan oleh penyedia jasa.${reasonText}`,
      "job_cancelled",
    );
  }
}

class CustomerCancellationNotifier extends CompletionNotifier {
  notify(previous, data) {
    const reasonText = data.cancellationReason ? ` Alasan: ${data.cancellationReason}` : "";
    this.deps.createNotification(
      previous.providerId,
      `Pesanan "${previous.service}" dibatalkan oleh pencari jasa.${reasonText}`,
      "job_cancelled",
    );
  }
}

class OrderService extends BaseService {
  constructor(deps) {
    super(deps);
    this.completionNotifiers = {
      provider: new ProviderCompletionNotifier(deps),
      customer: new CustomerCompletionNotifier(deps),
    };
    this.cancellationNotifiers = {
      provider: new ProviderCancellationNotifier(deps),
      customer: new CustomerCancellationNotifier(deps),
    };
  }

  async create(payload) {
    const validationError = validateCreateOrderPayload(payload);
    if (validationError) return validationError;
    const data = payload ?? {};

    const order = {
      id: this.createId(),
      ...data,
      status: "menunggu",
      createdAt: this.nowIso(),
      price: Number(data.price || 0),
      paymentMethod: data.paymentMethod || "langsung",
      paymentStatus: data.paymentStatus || "belum_dibayar",
      paymentRecordedAt: data.paymentRecordedAt || null,
    };

    this.state.orders.push(order);
    this.deps.createNotification(order.providerId, "Ada permintaan jasa baru!", "new_request");
    await this.deps.persist("orders", "notifications");
    return this.ok(201, { order });
  }

  async update(orderId, payload) {
    const id = Number(orderId);
    const index = this.state.orders.findIndex((order) => order.id === id);
    if (index === -1) {
      return this.fail(404, "Order tidak ditemukan.");
    }

    const data = payload ?? {};
    const previous = this.state.orders[index];
    this.state.orders[index] = { ...this.state.orders[index], ...data };
    const updated = this.state.orders[index];

    if (updated.status === "selesai" && previous.status !== "selesai" && !data.paymentStatus) {
      if (data.completedBy === "provider") {
        updated.paymentStatus = "menunggu_konfirmasi";
      } else if (data.completedBy === "customer") {
        updated.paymentStatus = "dibayar_langsung";
        updated.paymentRecordedAt = data.paymentRecordedAt || this.nowIso();
      }
    }

    const isNowCompleted = updated.status === "selesai" && previous.status !== "selesai";
    if (isNowCompleted) {
      const notifier = this.completionNotifiers[data.completedBy];
      if (notifier) notifier.notify(previous, data);
    }

    const isRejectedByProvider =
      (updated.status === "ditolak" || updated.status === "dibatalkan") &&
      previous.status !== updated.status &&
      data.cancelledBy === "provider";
    if (isRejectedByProvider) {
      this.cancellationNotifiers.provider.notify(previous, data);
    }

    const isCancelledByCustomer =
      updated.status === "dibatalkan" &&
      previous.status !== "dibatalkan" &&
      data.cancelledBy === "customer";
    if (isCancelledByCustomer) {
      this.cancellationNotifiers.customer.notify(previous, data);
    }

    if (this.deps.CLOSED_ORDER_STATUSES.has(updated.status)) {
      this.deps.clearChatsByOrder(updated.id);
    }

    await this.deps.persist("orders", "notifications", "chats");
    return this.ok(200, { order: updated });
  }
}

const createOrderService = (deps) => new OrderService(deps);

export { createOrderService };
