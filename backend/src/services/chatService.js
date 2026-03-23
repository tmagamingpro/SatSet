import { validateCreateChatPayload } from "../validators/chatValidator.js";

const createChatService = (deps) => {
  const { state, createId, nowIso, findActiveOrderForChat } = deps;

  const create = (payload) => {
    const validationError = validateCreateChatPayload(payload);
    if (validationError) return validationError;
    const data = payload ?? {};
    const senderId = Number(data.senderId);
    const receiverId = Number(data.receiverId);
    const message = (data.message || "").trim();
    const orderId = data.orderId;

    const sender = state.users.find((user) => user.id === senderId);
    const receiver = state.users.find((user) => user.id === receiverId);
    if (!sender || !receiver) {
      return { status: 404, body: { message: "Pengguna chat tidak ditemukan." } };
    }

    const activeOrder = findActiveOrderForChat({ senderId, receiverId, orderId });
    if (!activeOrder) {
      return {
        status: 403,
        body: {
          message:
            "Chat hanya tersedia saat ada transaksi aktif (menunggu/berlangsung). Setelah transaksi selesai, chat akan direset.",
        },
      };
    }

    const chat = {
      id: createId(),
      orderId: activeOrder.id,
      senderId,
      receiverId,
      message,
      createdAt: nowIso(),
    };
    state.chats.push(chat);
    return { status: 200, body: { chat } };
  };

  return { create };
};

export { createChatService };
