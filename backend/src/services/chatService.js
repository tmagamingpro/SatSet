import { validateCreateChatPayload } from "../validators/chatValidator.js";
import { BaseService } from "./baseService.js";

class ChatService extends BaseService {
  create(payload) {
    const validationError = validateCreateChatPayload(payload);
    if (validationError) return validationError;
    const data = payload ?? {};
    const senderId = Number(data.senderId);
    const receiverId = Number(data.receiverId);
    const message = (data.message || "").trim();
    const orderId = data.orderId;

    const sender = this.state.users.find((user) => user.id === senderId);
    const receiver = this.state.users.find((user) => user.id === receiverId);
    if (!sender || !receiver) return this.fail(404, "Pengguna chat tidak ditemukan.");

    const activeOrder = this.deps.findActiveOrderForChat({ senderId, receiverId, orderId });
    if (!activeOrder) {
      return this.fail(
        403,
        "Chat hanya tersedia saat ada transaksi aktif (menunggu/berlangsung). Setelah transaksi selesai, chat akan direset.",
      );
    }

    const chat = {
      id: this.createId(),
      orderId: activeOrder.id,
      senderId,
      receiverId,
      message,
      createdAt: this.nowIso(),
    };
    this.state.chats.push(chat);
    return this.ok(200, { chat });
  }
}

const createChatService = (deps) => new ChatService(deps);

export { createChatService };
