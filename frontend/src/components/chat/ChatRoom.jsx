import TopBar from "../../layouts/TopBar";
import AppIcon from "../AppIcon";
import { formatTime } from "../../utils/format";

const ChatRoom = ({
  selectedThread,
  currentUser,
  messages,
  message,
  onMessageChange,
  onSendMessage,
  onBack,
  messageContainerRef,
}) => {
  const isSendDisabled = !message.trim();

  const handleInputKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-50">
      <TopBar
        title={selectedThread.contact.name}
        subtitle={`Order: ${selectedThread.order.service}`}
        actions={
          <button
            onClick={onBack}
            className="h-8 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-600 border-none cursor-pointer"
          >
            Tutup
          </button>
        }
      />

      <div ref={messageContainerRef} className="flex-1 overflow-auto px-4 py-4 flex flex-col gap-2.5">
        {messages.length === 0 && (
          <div className="text-center text-slate-400 py-12">
            <div className="w-12 h-12 mx-auto rounded-full bg-white border border-slate-200 text-slate-400 flex items-center justify-center">
              <AppIcon name="message" size={24} />
            </div>
            <p className="mt-3 text-sm">Mulai percakapan untuk transaksi ini</p>
          </div>
        )}

        {messages.map((chat) => {
          const isMe = chat.senderId === currentUser?.id;
          return (
            <div key={chat.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[78%] px-3.5 py-2.5 text-sm shadow-sm border
                  ${
                    isMe
                      ? "bg-sky-600 text-white border-sky-500 rounded-[16px_4px_16px_16px]"
                      : "bg-white text-slate-700 border-slate-200 rounded-[4px_16px_16px_16px]"
                  }`}
              >
                <p className="whitespace-pre-wrap break-words">{chat.message}</p>
                <p className={`text-[10px] mt-1 text-right ${isMe ? "text-sky-100" : "text-slate-400"}`}>
                  {formatTime(chat.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-4 py-3 bg-white/95 backdrop-blur-sm border-t border-slate-200">
        <div className="flex items-center gap-2.5">
          <input
            value={message}
            onChange={(event) => onMessageChange(event.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Tulis pesan transaksi..."
            className="flex-1 px-3.5 py-2.5 border-2 border-slate-200 rounded-full text-sm bg-slate-50 outline-none focus:border-sky-600"
          />
          <button
            onClick={onSendMessage}
            disabled={isSendDisabled}
            className="bg-sky-600 text-white border-none rounded-full w-11 h-11 cursor-pointer flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <AppIcon name="send" size={17} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
