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
  return (
    <div className="flex flex-col h-screen">
      <TopBar
        title={selectedThread.contact.name}
        subtitle={`Order: ${selectedThread.order.service}`}
        actions={
          <button onClick={onBack} className="bg-transparent border-none cursor-pointer text-gray-400">
            <AppIcon name="x" size={18} />
          </button>
        }
      />
      <div ref={messageContainerRef} className="flex-1 overflow-auto px-5 py-4 flex flex-col gap-2.5 pb-20">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 py-10">
            <div className="flex justify-center">
              <AppIcon name="message" size={30} />
            </div>
            <p className="mt-2">Mulai percakapan untuk transaksi ini...</p>
          </div>
        )}
        {messages.map((chat) => {
          const isMe = chat.senderId === currentUser?.id;
          return (
            <div key={chat.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] px-3.5 py-2.5 text-sm shadow-sm
                  ${isMe ? "bg-sky-600 text-white rounded-[16px_4px_16px_16px]" : "bg-white text-gray-800 rounded-[4px_16px_16px_16px]"}`}
              >
                <div>{chat.message}</div>
                <div className="text-[10px] opacity-60 mt-1 text-right">{formatTime(chat.createdAt)}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="fixed bottom-0 left-0 right-0 px-4 py-3 bg-white border-t border-gray-100 flex gap-2.5 md:bottom-6 md:left-6 md:right-6 md:w-auto md:translate-x-0 md:rounded-2xl md:border md:border-gray-200 md:px-5 md:shadow-[0_12px_32px_rgba(15,23,42,0.14)]">
        <input
          value={message}
          onChange={(event) => onMessageChange(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && onSendMessage()}
          placeholder="Tulis pesan transaksi..."
          className="flex-1 px-3.5 py-2.5 border-2 border-gray-200 rounded-full text-sm bg-gray-50 outline-none focus:border-sky-600"
        />
        <button
          onClick={onSendMessage}
          className="bg-sky-600 text-white border-none rounded-full w-11 h-11 cursor-pointer flex items-center justify-center"
        >
          <AppIcon name="send" size={17} />
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
