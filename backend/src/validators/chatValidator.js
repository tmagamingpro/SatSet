const validateCreateChatPayload = (payload) => {
  const data = payload ?? {};
  const senderId = Number(data.senderId);
  const receiverId = Number(data.receiverId);
  const message = (data.message || "").trim();

  if (!senderId || !receiverId || !message) {
    return { status: 400, body: { message: "senderId, receiverId, dan message wajib diisi." } };
  }

  return null;
};

export { validateCreateChatPayload };
