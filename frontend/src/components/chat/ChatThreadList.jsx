import TopBar from "../../layouts/TopBar";
import Card from "../Card";
import Avatar from "../Avatar";
import { formatTime } from "../../utils/format";

const ChatThreadList = ({ threads, getMessages, onSelectThread }) => {
  return (
    <div className="pb-20">
      <TopBar title="Pesan" subtitle={`${threads.length} chat transaksi aktif`} />
      <div className="px-5 pt-5">
        {threads.length === 0 && (
          <Card className="p-4">
            <p className="text-sm text-gray-500">
              Chat hanya aktif saat ada transaksi berstatus menunggu/berlangsung. Setelah transaksi selesai, chat direset otomatis.
            </p>
          </Card>
        )}
        {threads.map((thread) => {
          const messages = getMessages(thread.order.id);
          const lastMessage = messages[messages.length - 1];
          return (
            <Card key={thread.order.id} onClick={() => onSelectThread(thread)} className="mb-2.5 py-3.5 px-4">
              <div className="flex gap-3 items-center">
                <Avatar name={thread.contact.name} size={48} colorIndex={thread.contact.id} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center gap-2">
                    <span className="font-bold truncate">{thread.contact.name}</span>
                    {lastMessage && <span className="text-[11px] text-gray-400">{formatTime(lastMessage.createdAt)}</span>}
                  </div>
                  <div className="text-[11px] text-sky-600 mt-0.5 truncate">Order: {thread.order.service}</div>
                  <div className="text-sm text-gray-400 mt-0.5 truncate">
                    {lastMessage ? lastMessage.message : "Belum ada pesan untuk transaksi ini"}
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

export default ChatThreadList;
