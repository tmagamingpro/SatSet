import { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import TopBar from "../layouts/TopBar";
import Card from "../components/Card";
import Avatar from "../components/Avatar";
import AppIcon from "../components/AppIcon";
import { formatTime } from "../utils/format";

const Chat = () => {
  const { currentUser, users, chats, addChat, setHideNavbar } = useApp();
  const [selectedChat, setSelectedChat] = useState(null);
  const [msg, setMsg] = useState("");
  const msgRef = useRef(null);

  const contacts = users.filter(u => u.id !== currentUser?.id && u.role !== "admin");
  const getMessages = (userId) => chats.filter(c =>
    (c.senderId === currentUser?.id && c.receiverId === userId) ||
    (c.senderId === userId && c.receiverId === currentUser?.id)
  ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const sendMsg = () => {
    if (!msg.trim() || !selectedChat) return;
    addChat({ senderId: currentUser.id, receiverId: selectedChat.id, message: msg });
    setMsg("");
  };

  useEffect(() => {
    if (msgRef.current) msgRef.current.scrollTop = msgRef.current.scrollHeight;
  }, [chats, selectedChat]);

  useEffect(() => {
    setHideNavbar(Boolean(selectedChat));
    return () => setHideNavbar(false);
  }, [selectedChat, setHideNavbar]);

  if (selectedChat) {
    const messages = getMessages(selectedChat.id);
    return (
      <div className="flex flex-col h-screen">
        <TopBar
          title={selectedChat.name}
          subtitle="Online"
          actions={
            <button onClick={() => setSelectedChat(null)} className="bg-transparent border-none cursor-pointer text-gray-400">
              <AppIcon name="x" size={18} />
            </button>
          }
        />
        <div ref={msgRef} className="flex-1 overflow-auto px-5 py-4 flex flex-col gap-2.5 pb-20">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 py-10">
              <div className="flex justify-center"><AppIcon name="message" size={30} /></div>
              <p className="mt-2">Mulai percakapan...</p>
            </div>
          )}
          {messages.map((m, i) => {
            const isMe = m.senderId === currentUser.id;
            return (
              <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] px-3.5 py-2.5 text-sm shadow-sm
                  ${isMe ? "bg-sky-600 text-white rounded-[16px_4px_16px_16px]" : "bg-white text-gray-800 rounded-[4px_16px_16px_16px]"}`}>
                  <div>{m.message}</div>
                  <div className="text-[10px] opacity-60 mt-1 text-right">{formatTime(m.createdAt)}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="fixed bottom-0 left-0 right-0 px-4 py-3 bg-white border-t border-gray-100 flex gap-2.5 md:bottom-6 md:left-6 md:right-6 md:w-auto md:translate-x-0 md:rounded-2xl md:border md:border-gray-200 md:px-5 md:shadow-[0_12px_32px_rgba(15,23,42,0.14)]">
          <input
            value={msg}
            onChange={e => setMsg(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMsg()}
            placeholder="Tulis pesan..."
            className="flex-1 px-3.5 py-2.5 border-2 border-gray-200 rounded-full text-sm bg-gray-50 outline-none focus:border-sky-600"
          />
          <button onClick={sendMsg} className="bg-sky-600 text-white border-none rounded-full w-11 h-11 cursor-pointer flex items-center justify-center">
            <AppIcon name="send" size={17} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <TopBar title="Pesan" subtitle={`${contacts.length} kontak`} />
      <div className="px-5 pt-5">
        {contacts.map(c => {
          const msgs = getMessages(c.id);
          const last = msgs[msgs.length - 1];
          return (
            <Card key={c.id} onClick={() => setSelectedChat(c)} className="mb-2.5 py-3.5 px-4">
              <div className="flex gap-3 items-center">
                <Avatar name={c.name} size={48} colorIndex={c.id} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <span className="font-bold">{c.name}</span>
                    {last && <span className="text-[11px] text-gray-400">{formatTime(last.createdAt)}</span>}
                  </div>
                  <div className="text-sm text-gray-400 mt-0.5 truncate">
                    {last ? last.message : `${c.role === "pencari" ? "Pencari" : "Penyedia"} Jasa`}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Chat;
