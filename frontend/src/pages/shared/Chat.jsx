import { useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "../../context/AppContext";
import ChatThreadList from "../../components/chat/ChatThreadList";
import ChatRoom from "../../components/chat/ChatRoom";

const Chat = () => {
  const { currentUser, users, orders, chats, addChat, setHideNavbar, showToast } = useApp();
  const [selectedThreadOrderId, setSelectedThreadOrderId] = useState(null);
  const [msg, setMsg] = useState("");
  const msgRef = useRef(null);
  const lastInactiveThreadRef = useRef(null);

  const activeOrders = useMemo(
    () =>
      orders
        .filter(
          (order) =>
            (order.customerId === currentUser?.id || order.providerId === currentUser?.id) &&
            (order.status === "menunggu" || order.status === "berlangsung"),
        )
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [orders, currentUser?.id],
  );

  const threads = useMemo(
    () =>
      activeOrders
        .map((order) => {
          const contactId = order.customerId === currentUser?.id ? order.providerId : order.customerId;
          const contact = users.find((user) => user.id === contactId && user.role !== "admin");
          if (!contact) return null;
          return { order, contact };
        })
        .filter(Boolean),
    [activeOrders, currentUser?.id, users],
  );

  const selectedThread = useMemo(
    () => threads.find((thread) => thread.order.id === selectedThreadOrderId) || null,
    [threads, selectedThreadOrderId],
  );

  const getMessages = (orderId) =>
    chats
      .filter((chat) => chat.orderId === orderId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const sendMsg = async () => {
    if (!msg.trim() || !selectedThread || !currentUser) return;
    const success = await addChat({
      orderId: selectedThread.order.id,
      senderId: currentUser.id,
      receiverId: selectedThread.contact.id,
      message: msg.trim(),
    });
    if (!success) return;
    setMsg("");
  };

  useEffect(() => {
    if (msgRef.current) msgRef.current.scrollTop = msgRef.current.scrollHeight;
  }, [chats, selectedThread]);

  useEffect(() => {
    setHideNavbar(Boolean(selectedThread));
    return () => setHideNavbar(false);
  }, [selectedThread, setHideNavbar]);

  useEffect(() => {
    if (!selectedThreadOrderId) return;
    const stillActive = threads.some((thread) => thread.order.id === selectedThreadOrderId);
    if (!stillActive && lastInactiveThreadRef.current !== selectedThreadOrderId) {
      lastInactiveThreadRef.current = selectedThreadOrderId;
      showToast("Transaksi selesai. Riwayat chat direset.", "info");
    }
  }, [selectedThreadOrderId, threads, showToast]);

  if (selectedThread) {
    const messages = getMessages(selectedThread.order.id);
    return (
      <ChatRoom
        selectedThread={selectedThread}
        currentUser={currentUser}
        messages={messages}
        message={msg}
        onMessageChange={setMsg}
        onSendMessage={sendMsg}
        onBack={() => setSelectedThreadOrderId(null)}
        messageContainerRef={msgRef}
      />
    );
  }

  return <ChatThreadList threads={threads} getMessages={getMessages} onSelectThread={(thread) => setSelectedThreadOrderId(thread.order.id)} />;
};

export default Chat;
